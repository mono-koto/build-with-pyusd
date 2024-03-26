# Mint Info

Let's now look at how we can display some basic info about the status of the mint and the user:

- The price of the mint
- The user's balance of PYUSD
- The number of tokens minted so far

## MintInfo component

We'll create a new file, `src/components/MintInfo.tsx` that fetches all this:

<<< @/../frontend/src/components/MintInfo.tsx

The key here is that we're using the hooks we created earlier to fetch the total issued amount, the mint price, and the user's balance. We then format them nicely and display them in the component.
