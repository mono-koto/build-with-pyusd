# Build a React app that uses PYUSD to mint NFTs

Let's build a simple Typescript React-based frontend that lets a user connect their wallet and interact with a smart contract that accepts PYUSD.

## What are we building?

It's generally a good idea to know what we want to build before we start. Here are the basic use cases we're going to cover in this walkthrough:

As a user, I want to:

1. Connect wallet to the app
2. Approve the contract to spend PYUSD
3. Mint one NFT
4. View the newly minted NFT

As the contract owner, I want to also:

1. View the total PYUSD balance
2. Withdraw PYUSD

## Before we start

You'll need a few things before we get going:

- An editor. We recommend [VS Code](https://code.visualstudio.com/).
- Node.js, which you can install in a few ways. We recommend [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions. We recommend using the latest LTS version of Node.js.
- The Node.js package manager of your choice. In this guide we'll use [npm](https://www.npmjs.com/), though [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), and [bun](https://bunpkg.com/) are all fine.

## Basics

### Get started with Vite

We'll use the [Vite](https://vitejs.dev/) build tool to scaffold and build our application. For React + Typescript, we can use the `react-ts` template.

```bash
npx create-vite@latest hello-pyusd-app --template react-ts
cd hello-pyusd-app
npm install
npm run dev
```

Once the dependencies install and the `dev` script runs, you'll see a message like this:

```bash
  VITE v5.1.6  ready in 290 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Go ahead and open that URL in your browser (port may differ if you're using `5173` for something else). You should see a simple React app with a counter:

![alt text](<CleanShot 2024-03-14 at 12.03.12@2x.png>)

This is our starting point! Remember to set up git and commit your changes:

```bash
git init
git add .
git commit -m "Initial commit"
```

### Add Tailwind CSS

We'll use [Tailwind CSS](https://tailwindcss.com/) to style our app. Following the [Tailwind Vite Guide](https://tailwindcss.com/docs/guides/vite), we can add it to our project with the following command:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.js` file so it knows where to look for tailwind classes:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

And finally replace your `src/index.css` with the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now let's trash the existing Vite defaults and replace them with a simple Tailwind layout. Replace `src/App.tsx` with the following:

```tsx
import HelloPyusd from "./components/HelloPyusd";

export default function App() {
  return (
    <>
      <HelloPyusd />
    </>
  );
}
```

And add a new file, `src/components/HelloPyusd.tsx`:

```tsx
export default function HelloPyusd() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
      <h1 className='text-xl'>Hello PYUSD!</h1>
    </div>
  );
}
```

Optionally, you can remove `src/App.css` and `src/assets` since we don't need those files anymore.

If you want to skip ahead and just put in all the styles we'll be using:

https://github.com/mono-koto/HelloPYUSD-frontend/blob/e031d7db74eca4a8691fef08858e0ebedfbad036/src/index.css

Let's commit our changes:

```bash
git add .
git commit -m "Add tailwind, remove default styles, add HelloPyusd component"
```

## Set up our Web3 stack

We're now ready to turn our web2 frontend into a web3 app!

We'll use a popular Web3 connection library called [RainbowKit](https://www.rainbowkit.com/) to connect to the user's wallet. RainbowKit is straightforward to integrate and supports almost all major wallets.[^connect-libs]

[^connect-libs]: Some similar modern options are [Web3Modal](https://web3modal.com/), [Family ConnectKit](https://docs.family.co/connectkit).

Following [RainbowKit's guide](https://www.rainbowkit.com/docs/installation), we'll install the package and set up the connection.

```bash
npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
```

Since `src/App.tsx` is our main entrypoint, let's add our imports and config there. We'll also import the `HelloPyusd` component we created earlier:

```tsx
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HelloPyusd from "./components/HelloPyusd";
```

The above imports bring in the RainbowKit styles, the chains we'll support, and a number of Provider compnents we'll wrap our app in.

Now let's configure RainbowKit. We'll use the `getDefaultConfig` function to specify how our app works with the WalletConnect modal, as well as the chains it supports.

```tsx
const config = getDefaultConfig({
  appName: "Hello PYUSD",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia, localhost],
});
```

We'll also set up a `QueryClient` instance that will be used by Tanstack Query, a state management library we'll use to manage our request/response state.

```tsx
const queryClient = new QueryClient();
```

Now we can wrap our app in the RainbowKit, Wagmi, and QueryClient providers:

```tsx
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HelloPyusd />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

And let's edit our `HelloPyusd` component to show a button for connecting/disconnecting:

```tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HelloPyusd() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
      <h1 className='text-xl'>Hello PYUSD!</h1>
      <ConnectButton />
    </div>
  );
}
```

We'll notice in our browser console that we're getting a `No projectId found` error. Let's fix this now.

### WalletConnect Project ID

See that weird `VITE_WALLETCONNECT_PROJECT_ID` variable above? That's pulled in as an environment variable, and it is a WalletConnect Project ID necessary to use Rainbow in its default configuration. We can get our Project ID by signing up at [WalletConnect Cloud](https://cloud.walletconnect.com) and creating a new project. You can leave it in "draft" mode for the purposes of this walkthrough:

![alt text](<CleanShot 2024-03-14 at 13.22.44.gif>)

Once we have our Project ID, let's creat a `.env` file in the root of our project and add it there:

```env
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
```

And let's add it to our `.gitignore` file:

```bash
// .gitignore
.env
```

Here's what we have now:

![alt text](<CleanShot 2024-03-14 at 14.01.30.gif>)

Let's commit our changes:

```bash
git add .
git commit -m "Add RainbowKit, set up WalletConnect, add ConnectButton"
```

## Interact with the smart contract

We're now ready to interact with a smart contract that accepts PYUSD, as well as the PYUSD contract itself.

We'll use the ERC721 smart contract we created in our other walkthrough. On Sepolia, we have this contract deployed at `0xc32ef01341487792201F6EFD908aB52CDC7b0775`(though you can use your own if you like).

### A few configuration details

#### ABIs

A contract's ABI – Application Binary Interface – is a document that describes how to interact with the contract. We need two ABIs here: our ERC-721 contract's ABI, and the standard ERC-20 ABI for PYUSD.

The library we're using, Viem (used by Wagmi, which is used by RainbowKit), will use these ABIs to infer types for us, so we don't have to write them ourselves.

We can get ABI JSON by processing the contract's source code (Foundry's `cast inspect` is great for this), or from a block explorer like [Etherscan](https://sepolia.etherscan.io/) by visiting a verified contract address and viewing its code. Then, we'll export the ABI as a typescript constant. Go ahead and create a `src/abi/HelloPyusd.abi.ts` file, and insert the exported JSON in like this:

```ts
export default /* your ABI JSON here */ as const;
```

Once this is done, we can import the ABI into our components and hooks!

#### Managing addresses

In addition to the ABIs, our code will also need access to the addresses of the PYUSD and NFT contracts. Since hese are different depending on the chain, we need a nice way to look them up.

Let's create a quick `src/config.ts` file. We'll define functions that return the address of the contracts on different chains. We'll also move our wagmi config into this new file.

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
```

### Creating some friendly hooks

If we already know what we're building and what we'll need to expose to the user, it can be helpful to start bottom up, and start writing concise functions that manage our state and make requests to the blockchain.

Since making requests to a blockchain RPC takes time, we need to manage asynchronous state. Wagmi's React package already does a lot of this for us, and we'll wrap some of its functionality in domain-specific hooks.

First let's set up some handy hooks for our HelloPYUSD contract. We'll create a new file, `src/hooks/helloPyusd.ts`:

```ts
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
```

Let's do the same for the ERC-20 that we'll use for payment. First, let's create a general `src/erc20.ts` module with the helpers we'll need for our ERC-20:

```ts
import { erc20Abi, zeroAddress, type Address } from "viem";
import { useReadContract, useReadContracts, useSimulateContract } from "wagmi";

/**
 * Custom hook to fetch ERC20 token information.
 * @param address - The address of the ERC20 token.
 * @returns An object containing the fetched token information.
 */
export function useToken(address: Address) {
  const result = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
    query: {
      staleTime: Infinity,
    },
  });
  return {
    ...result,
    data: result.data && {
      decimals: result.data[0],
      name: result.data[1],
      symbol: result.data[2],
    },
  };
}

/**
 * Retrieves the token balance for a specific account.
 * @param token - The address of the token contract.
 * @param account - The address of the account to retrieve the balance for.
 * @returns The token balance for the specified account.
 */
export function useTokenBalance(token: Address, account: Address | undefined) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account || zeroAddress],
    query: {
      enabled: Boolean(account),
    },
  });
}

/**
 * Get the allowance of a token for a specific account and spender.
 *
 * @param token - The address of the token contract.
 * @param account - The address of the account for which to check the allowance.
 * @param spender - The address of the spender for which to check the allowance.
 * @returns The result of the `allowance` function call from the token contract.
 */
export function useAllowance(
  token: Address,
  account: Address | undefined,
  spender: Address | undefined
) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account || zeroAddress, spender || zeroAddress],
    query: {
      enabled: Boolean(account) && Boolean(spender),
    },
  });
}

/**
 * Simulate the `approve` function of an ERC20 token contract.
 *
 * @param token - The address of the ERC20 token.
 * @param spender - The address of the spender.
 * @param amount - The amount to be approved.
 * @returns The result of the `useSimulateContract` hook.
 */
export function useSimulateApprove(
  token: Address,
  spender: Address | undefined,
  amount: bigint | undefined
) {
  return useSimulateContract({
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender || zeroAddress, amount || 0n],
    query: {
      enabled: Boolean(spender) && amount !== undefined,
    },
  });
}
```

Now we'll just need a simple hook to get our current payment token address. Let's create one more module, `src/hooks/paymentToken.ts`:

```ts
import { Address } from "viem";
import { useAccount } from "wagmi";
import { paymentTokenAddress } from "../config";

export function usePaymentTokenAddress(): Address {
  const { chain } = useAccount();
  return paymentTokenAddress(chain);
}
```

Great, we have our hooks in place. Let's get into the code.

### Sketching out our layout

Let's update our main `HelloPyusd` component. Nothing fancy here, just some basic layout and a `Mint` component that we'll build next.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/d583e28bd95b955a390bd20d40ca29457e6535d8/src/components/HelloPyusd.tsx

### Minting an NFT

We'll start by creating a new component, `src/components/Mint.tsx`. This component will allow the user to preview the NFT they'll mint, then mint it.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/d583e28bd95b955a390bd20d40ca29457e6535d8/src/components/Mint.tsx

We have three components to build here:

- `MintPreview` will show a preview of the NFT the user will mint.
- `MintButton` will allow the user to mint the NFT.
- `MintInfo` will show the price of the NFT and the user's balance.

Let's start with `MintPreview`. We'll create a new file, `src/components/MintPreview.tsx`:

#### `MintPreview.tsx`

We'll build this as a relatively simple `<div>` that is square and displays the image of the next token to be minted.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/a593df9550c2421c6053172b463d11bb4db5a58a/src/components/MintPreview.tsx

We'll create a separate subcomponent, `TokenImage`, to handle the image display.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/a593df9550c2421c6053172b463d11bb4db5a58a/src/components/TokenImage.tsx

You should now see a preview of the token you're about to mint in your app!

![alt text](<CleanShot 2024-03-20 at 13.57.47.gif>)

#### `MintInfo.tsx`

Let's now look at how we can display some basic info about the status of the mint and the user:

- The price of the mint
- The user's balance of PYUSD
- The number of tokens minted so far

We'll create a new file, `src/components/MintInfo.tsx` that fetches all this:

https://github.com/mono-koto/HelloPYUSD-frontend/blob/19caf2fab1603b8d7565c44a195547f69a6a3060/src/components/MintInfo.tsx

The key here is that we're using the hooks we created earlier to fetch the total issued amount, the mint price, and the user's balance. We then format them nicely and display them in the component.

Finally, let's uncomment the `MintInfo` component in `Mint.tsx`:

https://github.com/mono-koto/HelloPYUSD-frontend/blob/f59efc88b12c6f1628e7327532452f70770dc21e/src/components/Mint.tsx#L12

#### `MintButton.tsx`

This is the main component that will allow the user to mint the NFT. We'll create a new file, `src/components/MintButton.tsx`. We'll have a bunch of states to cover:

**No wallet is connected?**

Show a "Connect Wallet" button that pops up the RainbowKit modal.

**Wallet connected, but the user doesn't have enough ETH to approve (if needed) and mint?**

Show an "Insufficient ETH" message in a disabled button.

**The user has enough ETH but approval is needed?**

Show an "Approve" button that will call the `approve` function on the PYUSD contract.

**The user has enough ETH and approval is done?**

Show a "Mint" button that will call the `mint` function on the HelloPYUSD contract.

**Either of the above, but the user is waiting for a transaction to confirm?**

Show a loading message in a disabled button.

##### Toast 🍞

Before we get into all that, let's pull in a nice "toast" library to display temporary messages to the user. We'll use [React Hot Toast](https://react-hot-toast.com/), a simple and customizable toast library.

```bash
npm install react-hot-toast
```

And we can add it into our `App.tsx`:

https://github.com/mono-koto/HelloPYUSD-frontend/blob/e031d7db74eca4a8691fef08858e0ebedfbad036/src/App.tsx#L18

Now we can use `toast` in our `MintButton` component to display messages to the user.

##### Our `MintButtonView` component

We'll create a new file, `src/components/MintButtonView.tsx`, that will handle the display for the button. All logic will be in the parent component, `MintButton`.

//// TODO

##### `MintButton.tsx`

Now we can create our `MintButton` component. This will handle all the logic for the button, and use `MintButtonView` to display it.
