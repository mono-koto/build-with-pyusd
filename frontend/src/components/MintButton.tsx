import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  useAccount,
  useBalance,
  useGasPrice,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { WriteContractData } from "wagmi/query";
import { useChangeObserver } from "../hooks/changeObserver";
import {
  useAllowance,
  useSimulateApprove,
  useToken,
  useTokenBalance,
} from "../hooks/erc20";
import {
  useHelloPyusdAddress,
  useMintPrice,
  useSimulateMint,
  useTotalIssued,
} from "../hooks/helloPyusd";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import { shortHash } from "../util/format";
import MintButtonView from "./MintButtonView";

const APPROVAL_GAS_REQUIREMENT = 100000n;
const MINT_GAS_REQUIREMENT = 150000n;

export default function MintButton() {
  // Get the query client. We'll use this to reset queries after a successful write
  const queryClient = useQueryClient();

  // Get the current connected account, if any
  const account = useAccount();

  // Get a function to open the connect modal, if needed
  const { openConnectModal } = useConnectModal();

  // Get the address of the HelloPyusd contract and the payment token
  const nftAddress = useHelloPyusdAddress();
  const paymentTokenAddress = usePaymentTokenAddress();

  // Grab the token, mint price, and total issued amount using our custom hooks
  const paymentToken = useToken(paymentTokenAddress);
  const mintPrice = useMintPrice();
  const totalIssued = useTotalIssued();

  // Get the user's balance of the payment token and the current allowance for the minting contract
  const paymentTokenBalance = useTokenBalance(
    paymentTokenAddress,
    account.address
  );
  const allowance = useAllowance(
    paymentTokenAddress,
    account.address,
    nftAddress
  );

  // Check whether the user would be able to successfully approve PYUSD for the minting contract
  const simulateApprove = useSimulateApprove(
    paymentTokenAddress,
    nftAddress,
    mintPrice.data
  );

  // Set up for the actual writing to the contract
  const writeApprove = useWriteContract();

  // And set up a listener for the transaction receipt.
  // This only becomes enabled once the transaction has been submitted
  // and the `data` field is populated with the transaction hash
  const writeApproveTxnReceipt = useWaitForTransactionReceipt({
    hash: writeApprove.data,
  });

  // Check whether the user would be able to successfully mint a token
  const simulateMint = useSimulateMint();

  // Set up for the actual writing to the contract
  const writeMint = useWriteContract();

  // And set up a listener for the mint transaction receipt.
  const writeMintTxnReceipt = useWaitForTransactionReceipt({
    hash: writeMint.data,
  });

  // get user's native balance and current gas price so we can calculate whethr they'll have enough to
  // pay gas for the approval / minting transaction
  const nativeBalance = useBalance({
    address: account.address,
  });
  const gasPrice = useGasPrice();

  // We want to consistently display the same toast messages for all writes, so we'll use a helper function
  // that takes a promise (via writeContractAsync) and displays a toast message based on promise resolution status
  const toastWrite = (p: Promise<WriteContractData>) => {
    toast.promise(
      p,
      {
        loading: "Submitting txn...",
        success: "Txn submitted...",
        error: "Canceled",
      },
      {
        loading: {},
        success: {
          icon: "🚀",
        },
        error: {
          icon: "❌",
        },
      }
    );
  };

  // We have a custom hook for observing changes to the query result
  // so we can reset our state and display a toast message
  useChangeObserver(writeApproveTxnReceipt.status, "success", async () => {
    queryClient.resetQueries({ queryKey: simulateApprove.queryKey });
    queryClient.resetQueries({ queryKey: allowance.queryKey });
    toast.dismiss();
    toast.success(
      (paymentToken.data?.symbol || "Token") +
        " approved: " +
        shortHash(writeApproveTxnReceipt.data!.transactionHash)
    );

    // After a successful approval, we want to reset our simulation
    // and if its successful, we want to mint the token
    const simulate = await simulateMint.refetch();
    if (simulate.isSuccess) {
      toastWrite(writeMint.writeContractAsync(simulate.data.request));
    }
  });

  // We have a custom hook for observing changes to the transaciton
  // receipt query so we can reset our state and display a toast message
  useChangeObserver(writeMintTxnReceipt.status, "success", () => {
    queryClient.resetQueries({ queryKey: simulateMint.queryKey });
    queryClient.resetQueries({ queryKey: simulateApprove.queryKey });
    queryClient.resetQueries({ queryKey: paymentTokenBalance.queryKey });
    queryClient.resetQueries({ queryKey: allowance.queryKey });
    queryClient.resetQueries({ queryKey: totalIssued.queryKey });
    queryClient.resetQueries({ queryKey: nativeBalance.queryKey });

    toast.dismiss();
    toast.success(
      "Mint success: " + shortHash(writeMintTxnReceipt.data!.transactionHash)
    );
  });

  // We also watch for errors so we can display a toast message
  useChangeObserver(writeApproveTxnReceipt.status, "error", () => {
    toast.dismiss();
    toast.error("Transaction failed");
  });
  useChangeObserver(writeMintTxnReceipt.status, "error", () => {
    toast.dismiss();
    toast.error("Transaction failed");
  });

  /// Rendering logic

  // If the user isn't connected, we'll display a button to connect
  if (!account.isConnected) {
    return (
      <MintButtonView onClick={openConnectModal}>
        Connect to Mint
      </MintButtonView>
    );
  }

  console.log(
    nativeBalance.data,
    mintPrice.data,
    paymentToken.data,
    paymentTokenBalance.data,
    gasPrice.isSuccess
  );

  // If any of the queries are still loading, we'll display a loading message
  if (
    nativeBalance.isError ||
    mintPrice.isError ||
    paymentToken.isError ||
    paymentTokenBalance.isError ||
    gasPrice.isError
  ) {
    return <MintButtonView disabled>Error loading data...</MintButtonView>;
  }

  // If any of the queries are still loading, we'll display a loading message
  if (
    !nativeBalance.isSuccess ||
    !mintPrice.isSuccess ||
    !paymentToken.isSuccess ||
    !paymentTokenBalance.isSuccess ||
    !gasPrice.isSuccess
  ) {
    return <MintButtonView disabled>Loading...</MintButtonView>;
  }

  // Check if the mint simulation failed due to insufficient allowance
  const insufficientAllowance =
    simulateMint.error?.name === "ContractFunctionExecutionError" &&
    /insufficient allowance/.test(simulateMint.error.shortMessage);

  // Estimate the total gas cost for the minting transaction.
  // We use this just to make sure the user has enough native balance to pay for gas
  const totalGasCost =
    gasPrice.data *
    (MINT_GAS_REQUIREMENT +
      (insufficientAllowance ? APPROVAL_GAS_REQUIREMENT : 0n));

  // If the user doesn't have enough native balance to pay for gas, we'll display a message
  if (nativeBalance.data.value < totalGasCost) {
    return (
      <MintButtonView disabled>
        Insufficient {nativeBalance.data.symbol} for gas
      </MintButtonView>
    );
  }

  // If the user doesn't have enough of hte payment token balance to pay for the mint price,
  // we'll display a message
  if (paymentTokenBalance.data < mintPrice.data) {
    return (
      <MintButtonView disabled>
        Insufficient {paymentToken.data?.symbol}
      </MintButtonView>
    );
  }

  // If the minting is pending or we're fetching the transaction receipt, we'll display a loading message
  if (writeMint.isPending || writeMintTxnReceipt.isFetching) {
    return <MintButtonView disabled>Minting...</MintButtonView>;
  }

  // If the approval is pending or we're fetching the transaction receipt, we'll display a loading message
  if (writeApprove.isPending || writeApproveTxnReceipt.isFetching) {
    return <MintButtonView disabled>Approving...</MintButtonView>;
  }

  // If we can mint, we'll display a button to mint
  if (simulateMint.isSuccess) {
    return (
      <>
        <MintButtonView
          onClick={() =>
            toastWrite(writeMint.writeContractAsync(simulateMint.data.request))
          }
        >
          Mint HIPYUSD
        </MintButtonView>
      </>
    );
  }

  // If we can approve, we'll display a button to approve
  if (simulateApprove.isSuccess) {
    return (
      <MintButtonView
        onClick={() =>
          toastWrite(
            writeApprove.writeContractAsync(simulateApprove.data.request)
          )
        }
      >
        Mint
      </MintButtonView>
    );
  }
}
