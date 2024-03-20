import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useMintPrice, useTotalIssued } from "../hooks/helloPyusd";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";

export default function MintInfo() {
  const account = useAccount();
  const paymentToken = usePaymentTokenAddress();
  const token = useToken(paymentToken);
  const balance = useTokenBalance(paymentToken, account.address);
  const mintPrice = useMintPrice();
  const totalIssued = useTotalIssued();

  // If the token query has not loaded, display a loading message or error.
  if (!token.data) {
    return (
      <div className='text-sm opacity-50'>
        {token.error?.message || "Loading..."}
      </div>
    );
  }

  // We format the mint price and user balance using the token's decimals and Viem's formatUnits function.
  // If the mint price or user balance is still loading, we display a loading message.

  const formattedMintPrice = mintPrice.isSuccess
    ? formatUnits(mintPrice.data, token.data.decimals)
    : mintPrice.isPending
    ? "Loading..."
    : mintPrice.status;

  const formattedUserBalance = balance.isSuccess
    ? formatUnits(balance.data, token.data.decimals)
    : balance.isPending
    ? "Loading..."
    : mintPrice.status;

  // If the total issued query has loaded, we display the total minted tokens.

  const totalMinted = totalIssued.isSuccess
    ? totalIssued.data.toString()
    : totalIssued.isPending
    ? "Loading..."
    : mintPrice.status;

  return (
    <div className='grid grid-cols-2 gap-1 text-sm opacity-50'>
      <span>{token.data.symbol} Price</span>
      <span className='text-right'>{formattedMintPrice}</span>

      <span>Total Minted</span>
      <span className='text-right'>{totalMinted}</span>

      {account.isConnected && (
        <>
          <span>{token.data.symbol} Balance</span>
          <span className='text-right'>{formattedUserBalance}</span>
        </>
      )}
    </div>
  );
}
