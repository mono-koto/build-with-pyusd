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

  const formattedMintPrice =
    token.data && mintPrice.isSuccess
      ? formatUnits(mintPrice.data, token.data.decimals)
      : "Loading...";

  const totalMinted = totalIssued.isSuccess
    ? totalIssued.data.toString()
    : "Loading...";

  const formattedUserBalance =
    token.data && balance.isSuccess
      ? formatUnits(balance.data, token.data.decimals)
      : "Loading...";

  return (
    <div className='grid grid-cols-2 gap-1 text-sm opacity-50'>
      <span>{token.data?.symbol} Price</span>
      <span className='text-right'>{formattedMintPrice}</span>

      <span>Total Minted</span>
      <span className='text-right'>{totalMinted}</span>

      {account.isConnected && (
        <>
          <span>{token.data?.symbol} Balance</span>
          <span className='text-right'>{formattedUserBalance}</span>
        </>
      )}
    </div>
  );
}
