import { Address, extractChain } from "viem";
import { useChainId } from "wagmi";
import { wagmiConfig } from "../config";

export default function BlockExplorerLink({ address }: { address: Address }) {
  const chainId = useChainId();
  const chain = extractChain({
    id: chainId,
    chains: wagmiConfig.chains,
  });

  const url = chain?.blockExplorers?.default.url;
  if (!url) return <a>{address}</a>;
  return <a href={`${url}/address/${address}`}>{address}</a>;
}
