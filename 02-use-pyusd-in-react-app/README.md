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

We're now ready to interact with a smart contract that accepts PYUSD, as well as the PYUSD contract itself. We'll use the ERC721 smart contract we created in our other walkthrough. On Sepolia, we have this contract deployed at `0x4f3fcba5af502c8c5a4274fa71e9d07eb0bdf099`(though you can use your own if you like).

### ABIs

A contract's ABI – Application Binary Interface – is a document that describes how to interact with the contract. We need two ABIs here: our ERC-721 contract's ABI, and the standard ERC-20 ABI for PYUSD.

The library we're using, Viem (used by Wagmi, which is used by RainbowKit), will use these ABIs to infer types for us, so we don't have to write them ourselves.

We can get ABI JSON by processing the contract's source code (Foundry's `cast inspect` is great for this), or from a block explorer like [Etherscan](https://sepolia.etherscan.io/) by visiting a verified contract address and viewing its code.

However, in our case we only have a few functions on our contract beyond the standard ERC-721 interface:

```solidity
function mint() external;
function mintToken() external view returns (address);
function mintPrice() external view returns (uint256);
function totalIssued() external view returns (uint256);
```

Since our custom contract is _mostly_ a standard ERC721, we'll just handroll the ABI for those couple calls. We'll pull in the rest from Viem's built-ins.
