# Domain-specific hooks

Since making requests to a blockchain RPC takes time, we need to manage asynchronous state. [Wagmi](https://github.com/wagmi) 's React package already does a lot of this for us (using [Tanstack's React-Query](https://github.com/tanstack/react-query) under the hood), and we'll wrap some of its functionality in domain-specific hooks.

Given we already know what we need to let our user see and do, it can be helpful to start bottom up by writing concise functions that manage our state and make requests to the blockchain.

## Getting the PYUSD address

Because PYUSD has different addresses depending on the chain (e.g. Sepolia vs Mainnet) we'll need a simple hook to get our current payment token address based on config + chain. Let's create one more module, `src/hooks/paymentToken.ts`:

<<< @/../frontend/src/hooks/paymentToken.ts

## PYUSD hooks

Next, let's write some hooks for the PYUSD ERC-20 that we'll use for payment. First, let's create a general `src/erc20.ts` module with the helpers we'll need for our ERC-20:

<<< @/../frontend/src/hooks/erc20.ts

## NFT contract hooks

Finally, let's set up some handy hooks for our HelloPYUSD contract. We'll create a new file, `src/hooks/helloPyusd.ts`:

<<< @/../frontend/src/hooks/helloPyusd.ts

Great, we have our hooks in place. Let's commit our changes:

```shell
git add .
git commit -m "Add hooks for getting contract data and simulating writes"
```
