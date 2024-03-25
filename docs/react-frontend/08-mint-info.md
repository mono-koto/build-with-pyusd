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
