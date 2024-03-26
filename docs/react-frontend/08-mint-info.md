# Mint Info

Let's now look at how we can display some basic info about the status of the mint and the user:

- The price of the mint in PYUSD
- The user's balance of PYUSD
- The number of tokens minted so far

We'll create a new file, `src/components/MintInfo.tsx` that fetches all this.

## Formatting PYUSD amounts

You may have noticed that we're dealing with `bigint` values for the PYUSD amounts. We'll need to format these nicely for display by consulting the token's `decimals` value (which is `6`, but we'll look it up dynamically so that our solution is more general).

`viem` provides a `formatUnits` function that can help with this.

```tsx
import { formatUnits } from "viem";
//...

const formattedMintPrice = mintPrice.isSuccess
  ? formatUnits(mintPrice.data, token.data.decimals)
  : mintPrice.isPending
  ? "Loading..."
  : mintPrice.status;
```

Here, our `formattedMintPrice` will be a string that represents the mint price in PYUSD. If mintPrice has loaded, we'll format it using `formatUnits` and the token's `decimals`. If it's still loading, we'll show "Loading...". If it's in any other state, we'll just show it directly.

## MintInfo component

<<< @/../frontend/src/components/MintInfo.tsx

The key here is that we're using the hooks we created earlier to fetch the total issued amount, the mint price, and the user's balance. We then format them nicely and display them in the component.
