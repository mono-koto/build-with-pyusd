import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import { sepolia, localhost, mainnet } from "viem/chains";

export function paymentTokenAddress(chain: Chain | undefined): Address {
  switch (chain) {
    case undefined:
    case sepolia:
    case localhost:
      // PYUSD Sepolia
      return "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
    case mainnet:
      // PYUSD Mainnet
      return "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8";
    default:
      throw new Error(
        `Payment token address not configured for chain ${chain}`
      );
  }
}

export function helloPyusdAddress(chain: Chain | undefined): Address {
  switch (chain) {
    case undefined:
    case sepolia:
    case localhost:
      // use your own HelloPYUSD address, or this one!
      return "0xc32ef01341487792201F6EFD908aB52CDC7b0775";
    default:
      throw new Error(`HelloPyusd address not configured for chain ${chain}`);
  }
}

// Moving our wagmi config here cleans up our App.tsx
// You can update App.tsx to import this.
export const wagmiConfig = getDefaultConfig({
  appName: "Hello PYUSD",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [sepolia, localhost],
  transports: {
    [localhost.id]: http("http://localhost:8545"),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});
