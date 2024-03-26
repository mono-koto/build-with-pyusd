# Writing React hooks

Since making requests to a blockchain RPC takes time, we need to manage asynchronous state. [Wagmi](https://github.com/wagmi) 's React package already does a lot of this for us (using [Tanstack's React-Query](https://github.com/tanstack/react-query) under the hood), and we'll wrap some of its functionality in domain-specific hooks.

Given we already know what we need to let our user see and do, it can be helpful to start bottom up by writing concise functions that manage our state and make requests to the blockchain.

## NFT contract hooks

First let's set up some handy hooks for our HelloPYUSD contract. We'll create a new file, `src/hooks/helloPyusd.ts`:

<<< @/../frontend/src/hooks/helloPyusd.ts

## ERC-20 (PYUSD) hooks

Let's do the same for the ERC-20 that we'll use for payment. First, let's create a general `src/erc20.ts` module with the helpers we'll need for our ERC-20:

<<< @/../frontend/src/hooks/erc20.ts

Now we'll just need a simple hook to get our current payment token address. Let's create one more module, `src/hooks/paymentToken.ts`:

<<< @/../frontend/src/hooks/paymentToken.ts

Great, we have our hooks in place. Let's commit our changes:

```shell
git add .
git commit -m "Add hooks for getting contract data and simulating writes"
```
