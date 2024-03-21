import { Address } from "viem";
import { useAccount } from "wagmi";

export default function BlockExplorerLink({ address }: { address: Address }) {
  const { chain } = useAccount();

  const url = chain?.blockExplorers?.default.url;
  if (!url) return <a>{address}</a>;
  return <a href={`${url}/address/${address}`}>{address}</a>;
}
