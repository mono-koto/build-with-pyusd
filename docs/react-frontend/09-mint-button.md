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

```shell
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
