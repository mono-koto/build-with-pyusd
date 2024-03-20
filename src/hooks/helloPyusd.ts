import { type Address } from "viem";
import { useAccount, useReadContract, useSimulateContract } from "wagmi";
import HelloPyusdAbi from "../abi/HelloPyusd.abi";
import { helloPyusdAddress } from "../config";

/**
 * Gets the address for the HelloPyusd contract based on the current chain.
 * @returns The address of the HelloPyusd contract to use.
 */
export function useHelloPyusdAddress(): Address {
  const { chain } = useAccount();
  return helloPyusdAddress(chain);
}

/**
 * Custom hook that retrieves the total issued amount from the HelloPyusd contract.
 * @returns Tanstack Query response with the total issued amount.
 */
export function useTotalIssued() {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "totalIssued",
  });
}

/**
 * Fetch metadata for a given token ID.
 * @param tokenId - The ID of the token.
 * @returns Tanstack Query response for metadata for the token, including the image and name.
 */
export function useMetadata(tokenId: bigint) {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "tokenURI",
    args: [tokenId!],
    query: {
      enabled: tokenId !== undefined,
      select: (tokenURI: string) => {
        const metadata = JSON.parse(atob(tokenURI.split(",")[1]));
        return metadata as { image: string; name: string };
      },
    },
  });
}

/**
 * Get the mint price.
 * @returns Tanstack Query response for the mint price.
 */
export function useMintPrice() {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "mintPrice",
  });
}

/**
 * Simulate the minting of a token.
 * @returns Tanstack Query response of the simulated minting.
 */
export function useSimulateMint() {
  const address = useHelloPyusdAddress();
  return useSimulateContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "mint",
  });
}
