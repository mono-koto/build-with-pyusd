# Sketching out our layout

Let's update our main `HelloPyusd` component. Nothing fancy here, just some basic layout and a `Mint` component that we'll build next.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/d583e28bd95b955a390bd20d40ca29457e6535d8/src/components/HelloPyusd.tsx

## Minting an NFT

We'll start by creating a new component, `src/components/Mint.tsx`. This component will allow the user to preview the NFT they'll mint, then mint it.

https://github.com/mono-koto/HelloPYUSD-frontend/blob/d583e28bd95b955a390bd20d40ca29457e6535d8/src/components/Mint.tsx

We have three components to build here:

- `MintPreview` will show a preview of the NFT the user will mint.
- `MintButton` will allow the user to mint the NFT.
- `MintInfo` will show the price of the NFT and the user's balance.

Let's start with `MintPreview`. We'll create a new file, `src/components/MintPreview.tsx`:
