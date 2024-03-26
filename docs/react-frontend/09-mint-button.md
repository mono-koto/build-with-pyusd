# Mint Button

Finally, let's get into building the actual interaction that will allow the user to mint the NFT. We'll need to handle a few different states:

| State                                                                                   | How we handle it                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| No wallet is connected?                                                                 | Show a "Connect Wallet" button that pops up the RainbowKit modal.                     |
| Wallet connected, but the user doesn't have enough ETH to approve (if needed) and mint? | Show an "Insufficient ETH" message in a disabled button.                              |
| The user has enough ETH but approval is needed?                                         | Show an "Approve" button that will call the `approve` function on the PYUSD contract. |
| The user has enough ETH and approval is done?                                           | Show a "Mint" button that will call the `mint` function on the HelloPYUSD contract.   |
| Either of the above, but the user is waiting for a transaction to confirm?              | Show a loading message in a disabled button.                                          |

## A few prerequisites

### 🍞 Toast

But before we get into all that, let's pull in a nice "toast" library to display temporary messages to the user. We'll use [React Hot Toast](https://react-hot-toast.com/), a simple and customizable toast library.

```shell
npm install react-hot-toast
```

And we can add it into our `App.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // [!code focus]
import { WagmiProvider } from "wagmi";

// snipped

<WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider
      theme={{
        lightMode: lightTheme(),
        darkMode: darkTheme(),
      }}
    >
      <HelloPyusd />
      <Toaster // [!code focus:16]
        toastOptions={{
          success: {
            icon: "🌈",
          },
          error: {
            icon: "🔥",
          },
          position: "bottom-right",
          duration: 5000,
          style: {
            background: "#666",
            color: "#ccc",
          },
        }}
      />
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>;
```

Now we can use `toast` in our `MintButton` component to display messages to the user.

### MintButtonView

We'll create a new file, `src/components/MintButtonView.tsx`, that will handle the display for the button. All logic will be in the parent component, `MintButton`.

<<< @/../frontend/src/components/MintButtonView.tsx

With out `.mintButton` css class.

```css
.mintButton {
  @apply w-full border-2 border-zinc-800 text-xl p-3 transition-colors;
  @apply hover:enabled:bg-zinc-800 hover:enabled:text-zinc-300;
  @apply dark:border-zinc-300 dark:hover:enabled:bg-zinc-300 dark:hover:enabled:text-zinc-800;
  @apply active:enabled:border-yellow-400 active:enabled:bg-yellow-400 active:text-zinc-800;
  @apply disabled:opacity-50;
}
```

## Anatomy of MintButton

Now we can create our `MintButton` component. This will handle all the logic for the button, and use `MintButtonView` to display it.

We'll break it down into a few parts:

1. Fetching relevant state
2. Simulating and writing the PYUSD approval
3. Simulating and writing the mint
4. Waiting for transactions to confirm and updating the UI

## Fetching relevant state

We need to grab a bunch of information – the payment token info, the mint price, total issued, balance of the user, allowance – in order to know what to display. Luckily, we've already written hooks to get most of this information!

```tsx
// Get the address of the HelloPyusd contract and the payment token
const nftAddress = useHelloPyusdAddress();
const paymentTokenAddress = usePaymentTokenAddress();

// Grab the token, mint price, and total issued amount using our custom hooks
const paymentToken = useToken(paymentTokenAddress);
const mintPrice = useMintPrice();
const totalIssued = useTotalIssued();

// Get the user's balance of the payment token and the current allowance for the minting contract
const paymentTokenBalance = useTokenBalance(
  paymentTokenAddress,
  account.address
);
const allowance = useAllowance(
  paymentTokenAddress,
  account.address,
  nftAddress
);
```

## PYUSD approval transaction

Viem and wagmi make it easy to simulate and transactions, which lets us ensure a transaction is likely to succeed before presenting the user with an option to perform it.

Let's use our `simulateApprove` function to check if the user is able to approve. We'll also instantiate a `writeApprove` function to handle the actual writing to the contract.

```tsx
// Check whether the user would be able to successfully approve PYUSD for the minting contract
const simulateApprove = useSimulateApprove(
  paymentTokenAddress,
  nftAddress,
  mintPrice.data
);

// Set up for the actual writing to the contract
const writeApprove = useWriteContract();

// And set up a listener for the transaction receipt.
// This only becomes enabled once the transaction has been submitted
// and the `data` field is populated with the transaction hash
const writeApproveTxnReceipt = useWaitForTransactionReceipt({
  hash: writeApprove.data,
});
```

Later on, we'll use use these values to determine what to display to the user.

```tsx
// If we can approve, we'll display a button to approve
if (simulateApprove.isSuccess) {
  return (
    <MintButtonView
      onClick={() =>
        toastWrite(
          writeApprove.writeContractAsync(simulateApprove.data.request)
        )
      }
    >
      Mint
    </MintButtonView>
  );
}
```

## Mint transaction

We'll do the same for the minting process. We'll simulate the mint, then write the mint, and finally wait for the transaction to confirm.

```tsx
// Check whether the user would be able to successfully mint a token
const simulateMint = useSimulateMint();

// Set up for the actual writing to the contract
const writeMint = useWriteContract();

// And set up a listener for the mint transaction receipt.
const writeMintTxnReceipt = useWaitForTransactionReceipt({
  hash: writeMint.data,
});
```

And we'll use these values to determine what to display to the user.

```tsx
// If we can mint, we'll display a button to mint
if (simulateMint.isSuccess) {
  return (
    <>
      <MintButtonView
        onClick={() =>
          toastWrite(writeMint.writeContractAsync(simulateMint.data.request))
        }
      >
        Mint HIPYUSD
      </MintButtonView>
    </>
  );
}
```

## Confirming in the UI

We'll use those `waitApproveTxnReceipt` to show a loading toast message once the transaction has settled, and to reset queries so that our UI updates. For example, with a successful approval, we'll reset the queries for the simulation and the allowance, and display a success message.

```tsx
// We have a custom hook for observing changes to the query result
// so we can reset our state and display a toast message
useChangeObserver(writeApproveTxnReceipt.status, "success", async () => {
  queryClient.resetQueries({ queryKey: simulateApprove.queryKey });
  queryClient.resetQueries({ queryKey: allowance.queryKey });
  toast.dismiss();
  toast.success(
    (paymentToken.data?.symbol || "Token") +
      " approved: " +
      shortHash(writeApproveTxnReceipt.data!.transactionHash)
  );

  // After a successful approval, we want to reset our simulation
  // and if its successful, we want to mint the token
  const simulate = await simulateMint.refetch();
  if (simulate.isSuccess) {
    toastWrite(writeMint.writeContractAsync(simulate.data.request));
  }
});

// We also watch for errors so we can display a toast message
useChangeObserver(writeApproveTxnReceipt.status, "error", () => {
  toast.dismiss();
  toast.error("Transaction failed");
});
```

Note in particular that if it is successful we will then refetch the mint simulation and attempt an immediate write of the mint. This saves the user a click and makes the process feel quicker.

Similarly, we'll do the same waiting on the minting transaction. Notice that after a successful mint, we reset all the queries that we used to display the mint button, and display a success message.

```tsx
useChangeObserver(writeMintTxnReceipt.status, "success", () => {
  queryClient.resetQueries({ queryKey: simulateMint.queryKey });
  queryClient.resetQueries({ queryKey: simulateApprove.queryKey });
  queryClient.resetQueries({ queryKey: paymentTokenBalance.queryKey });
  queryClient.resetQueries({ queryKey: allowance.queryKey });
  queryClient.resetQueries({ queryKey: totalIssued.queryKey });
  queryClient.resetQueries({ queryKey: nativeBalance.queryKey });

  toast.dismiss();
  toast.success(
    "Mint success: " + shortHash(writeMintTxnReceipt.data!.transactionHash)
  );
});

useChangeObserver(writeMintTxnReceipt.status, "error", () => {
  toast.dismiss();
  toast.error("Transaction failed");
});
```

## Other odds and ends

We won't cover every part of the file completely, but one other thing we do is calculate the costs for both the approval and minting transactions. We use this to make sure the user has enough balance to pay for gas and/or the token. If they don't, we'll display a message to the user:

```tsx
const APPROVAL_GAS_REQUIREMENT = 100000n;
const MINT_GAS_REQUIREMENT = 150000n;

///...

const gasPrice = useGasPrice();

///...

const insufficientAllowance =
  simulateMint.error?.name === "ContractFunctionExecutionError" &&
  /insufficient allowance/.test(simulateMint.error.shortMessage);

// Estimate the total gas cost for the minting transaction.
// We use this just to make sure the user has enough native balance to pay for gas
const totalGasCost =
  gasPrice.data *
  (MINT_GAS_REQUIREMENT +
    (insufficientAllowance ? APPROVAL_GAS_REQUIREMENT : 0n));

// If the user doesn't have enough native balance to pay for gas, we'll display a message
if (nativeBalance.data.value < totalGasCost) {
  return (
    <MintButtonView disabled>
      Insufficient {nativeBalance.data.symbol} for gas
    </MintButtonView>
  );
}

// If the user doesn't have enough of the payment token balance to pay for the mint price,
// we'll display a message
if (paymentTokenBalance.data < mintPrice.data) {
  return (
    <MintButtonView disabled>
      Insufficient {paymentToken.data.symbol}
    </MintButtonView>
  );
}
```

## The complete `MintButton`

Here's our final `MintButton.tsx`:

<<< @/../frontend/src/components/MintButton.tsx
