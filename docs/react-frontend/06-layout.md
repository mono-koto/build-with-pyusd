# Our Mint Layout

Let's start by creating a layout for our minting page. This will include a preview of the NFT the user will mint, the price of the NFT, and the user's balance.

## Updating HelloPYUSD layout

Let's update our main `HelloPyusd` component. Nothing fancy here, just some basic layout and a `Mint` component that we'll build next.

```tsx{15}
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Mint from "./Mint";

export default function HelloPyusd() {
return (
    <div className='container max-w-4xl p-4 md:p-8 mx-auto flex flex-col min-h-screen gap-8'>
      <nav className='flex flex-row gap-4 items-center justify-between'>
        <div>
          <h1 className='text-xl font-black'>Hello PYUSD!</h1>
          <p className='text-sm text-gray-500'>Open edition PYUSD NFT</p>
        </div>
        <ConnectButton />
      </nav>
      <div className='flex-1'>
        <Mint /> {/* We'll build this next */}
      </div>
    </div>
  );
}
```

## The Mint component

We'll start by creating a new component, `src/components/Mint.tsx`. This component will allow the user to preview the NFT they'll mint, then mint it.

```tsx{9,12,13}
import MintPreview from "./MintPreview";
import MintInfo from "./MintInfo";
import MintButton from "./MintButton";

export default function Mint() {
  return (
    <div className='flex flex-col md:flex-row gap-16 items-center'>
      <div className='w-full md:w-3/5'>
        <MintPreview />
      </div>
      <div className='w-full md:w-2/5 space-y-4'>
        <MintButton />
        <MintInfo />
      </div>
    </div>
  );
}
```

We have three components to build here:

- `MintPreview` will show a preview of the NFT the user will mint.
- `MintButton` will allow the user to mint the NFT.
- `MintInfo` will show the price of the NFT and the user's balance.

You can comment out the unfinished components to avoid errors for now.
