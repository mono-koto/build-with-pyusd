import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import { localhost, mainnet, sepolia } from "viem/chains";

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
      return "0xC3106f588711e4672c43D7C2dD9cE995BD44C231";
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
