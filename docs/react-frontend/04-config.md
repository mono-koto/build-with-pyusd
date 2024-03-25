# ABIs and Addresses

We're now ready to interact with a smart contract that accepts PYUSD, as well as the PYUSD contract itself. But to do so, we need two kinds of info:

- ABIs - the _what_ of the contracts
- Addresses - the _where_ of the contracts

## ABIs

A contract's ABI – Application Binary Interface – is a document that describes how to interact with the contract. We need two ABIs here: our ERC-721 contract's ABI, and the standard ERC-20 ABI for PYUSD.

The library we're using, Viem (used by Wagmi, which is used by RainbowKit), will use these ABIs to infer types for us, so we don't have to write them ourselves.

We can get ABI JSON by processing the contract's source code (Foundry's `cast inspect` is great for this), or from a block explorer like [Etherscan](https://sepolia.etherscan.io/) by visiting a verified contract address and viewing its code. Then, we'll export the ABI as a typescript constant. Go ahead and create a `src/abi/HelloPyusd.abi.ts` file, and insert the exported JSON in like this:

```ts
export default /* your ABI JSON here */ as const;
```

Once this is done, we can import the ABI into our components and hooks!

## Addresses

In addition to the ABIs, our code will also need access to the addresses of the PYUSD and NFT contracts. Since these are different depending on the chain, we need a nice way to look them up.

We'll use the ERC721 smart contract we created in our other walkthrough. On Sepolia, we have this contract deployed at `0xc32ef01341487792201F6EFD908aB52CDC7b0775` (though you can use your own if you like). And we can use the PYUSD contract at `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`.

Let's create a quick `src/config.ts` file. We'll define functions that return the address of the contracts on different chains.

```ts
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
```

While we're at it, let's move our wagmi config into this file as well:

```ts
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
```

Let's commit our changes:

```shell
git add .
git commit -m "Add ABIs and config module"
```
