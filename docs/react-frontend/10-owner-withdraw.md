# Owner withdraw

We have one important action left to implement for the owner: withdrawing PYUSD from the contract. This is a simple feature that will allow the owner to view the PYUSD balance on the contract and withdraw it to their wallet.

![Owner actions](./assets/owner-actions.gif)

## Monitoring the balance

In order to display a constantly up to date balance to the owner, we'll need to regularly invalidate the query of the accrued PYUSD. To do this, we'll use the `useBlockNumber` hook to watch for new blocks and invalidate the query when a new block is mined.

```tsx
const accruedPyusd = useTokenBalance(paymentToken, helloPyusdAddress);

const queryClient = useQueryClient();
const { data: blockNumber } = useBlockNumber({ watch: true });

useEffect(() => {
  queryClient.invalidateQueries({ queryKey: accruedPyusd.queryKey });
}, [blockNumber, queryClient]);
```

## Conditionally displaying the owner info:

We query the owner of the contract and compare it to the connected wallet address. If the connected wallet is not the owner, we return `null` so nothing is rendered:

```tsx
const owner = useReadContract({
  address: helloPyusdAddress,
  abi: HelloPyusdAbi,
  functionName: "owner",
});

if (!account.isConnected || account.address !== owner.data) {
  return null;
}
```

## Withdrawing PYUSD

Similar to the minting cases in the last section, we simulate the withdraw, and only let the user actually withdraw if the simulation is successful:

```tsx
const simulateWithdraw = useSimulateContract({
  address: helloPyusdAddress,
  abi: HelloPyusdAbi,
  functionName: "withdrawToken",
  args: [paymentToken, account.address || zeroAddress],
  query: {
    enabled: account.isConnected,
  },
});
const writeWithdraw = useWriteContract();
useChangeObserver(writeWithdraw.status, "success", () => {
  accruedPyusd.refetch();
});

/// ...

<button
  className='w-full mx-auto block button'
  disabled={!simulateWithdraw.isSuccess || accruedPyusd.data === 0n}
  onClick={() => writeWithdraw.writeContract(simulateWithdraw.data!.request)}
>
  Withdraw
</button>;
```

We could move some of these actions into our domain specific hooks, but for now we'll leave them in the component.

## Final OwnerActions component

<<< @/../frontend/src/components/OwnerActions.tsx
