import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatUnits, zeroAddress } from "viem";
import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import HelloPyusdAbi from "../abi/HelloPyusd.abi";
import { useChangeObserver } from "../hooks/changeObserver";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { useHelloPyusdAddress } from "../hooks/helloPyusd";
import { usePaymentTokenAddress } from "../hooks/paymentToken";

export default function OwnerActions() {
  const account = useAccount();
  const paymentToken = usePaymentTokenAddress();
  const token = useToken(paymentToken);
  const helloPyusdAddress = useHelloPyusdAddress();
  const accruedPyusd = useTokenBalance(paymentToken, helloPyusdAddress);

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: accruedPyusd.queryKey });
  }, [blockNumber, queryClient]);

  const owner = useReadContract({
    address: helloPyusdAddress,
    abi: HelloPyusdAbi,
    functionName: "owner",
  });

  const simulateWithdraw = useSimulateContract({
    address: helloPyusdAddress,
    abi: HelloPyusdAbi,
    functionName: "withdrawToken",
    args: [paymentToken, account.address || zeroAddress],
    query: {
      enabled: account.isConnected,
    },
  });
  const writeWithdraw = useWriteContract();
  useChangeObserver(writeWithdraw.status, "success", () => {
    accruedPyusd.refetch();
  });

  if (!account.isConnected || account.address !== owner.data) {
    return null;
  }

  if (!token.data || !accruedPyusd.isSuccess) {
    return (
      <div className='text-sm opacity-50'>
        {token.error?.message || "Loading..."}
      </div>
    );
  }

  return (
    <section className='overflow-clip text-sm border-2 border-zinc-500 border-opacity-50 p-3 space-y-2'>
      <div className='flex justify-between'>
        <span>{token.data.symbol} Available</span>
        <span>
          {accruedPyusd.isSuccess
            ? formatUnits(accruedPyusd.data, token.data.decimals)
            : "Loading..."}
        </span>
      </div>

      <button
        className='w-full mx-auto block button'
        disabled={!simulateWithdraw.isSuccess || accruedPyusd.data === 0n}
        onClick={() =>
          writeWithdraw.writeContract(simulateWithdraw.data!.request)
        }
      >
        Withdraw
      </button>
    </section>
  );
}
