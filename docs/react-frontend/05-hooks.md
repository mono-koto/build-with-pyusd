# Writing React hooks

Since making requests to a blockchain RPC takes time, we need to manage asynchronous state. [Wagmi](https://github.com/wagmi) 's React package already does a lot of this for us (using [Tanstack's React-Query](https://github.com/tanstack/react-query) under the hood), and we'll wrap some of its functionality in domain-specific hooks.

Given we already know what we need to let our user see and do, it can be helpful to start bottom up by writing concise functions that manage our state and make requests to the blockchain.

First let's set up some handy hooks for our HelloPYUSD contract. We'll create a new file, `src/hooks/helloPyusd.ts`:

```ts
import { type Address } from "viem";
import { useAccount, useReadContract, useSimulateContract } from "wagmi";
import HelloPyusdAbi from "../abi/HelloPyusd.abi";
import { helloPyusdAddress } from "../config";

/**
 * Gets the address for the HelloPyusd contract based on the current chain.
 * @returns The address of the HelloPyusd contract to use.
 */
export function useHelloPyusdAddress(): Address {
  const { chain } = useAccount();
  return helloPyusdAddress(chain);
}

/**
 * Custom hook that retrieves the total issued amount from the HelloPyusd contract.
 * @returns Tanstack Query response with the total issued amount.
 */
export function useTotalIssued() {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "totalIssued",
  });
}

/**
 * Fetch metadata for a given token ID.
 * @param tokenId - The ID of the token.
 * @returns Tanstack Query response for metadata for the token, including the image and name.
 */
export function useMetadata(tokenId: bigint) {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "tokenURI",
    args: [tokenId!],
    query: {
      enabled: tokenId !== undefined,
      select: (tokenURI: string) => {
        const metadata = JSON.parse(atob(tokenURI.split(",")[1]));
        return metadata as { image: string; name: string };
      },
    },
  });
}

/**
 * Get the mint price.
 * @returns Tanstack Query response for the mint price.
 */
export function useMintPrice() {
  const address = useHelloPyusdAddress();
  return useReadContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "mintPrice",
  });
}

/**
 * Simulate the minting of a token.
 * @returns Tanstack Query response of the simulated minting.
 */
export function useSimulateMint() {
  const address = useHelloPyusdAddress();
  return useSimulateContract({
    address,
    abi: HelloPyusdAbi,
    functionName: "mint",
  });
}
```

Let's do the same for the ERC-20 that we'll use for payment. First, let's create a general `src/erc20.ts` module with the helpers we'll need for our ERC-20:

```ts
import { erc20Abi, zeroAddress, type Address } from "viem";
import { useReadContract, useReadContracts, useSimulateContract } from "wagmi";

/**
 * Custom hook to fetch ERC20 token information.
 * @param address - The address of the ERC20 token.
 * @returns An object containing the fetched token information.
 */
export function useToken(address: Address) {
  const result = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
    query: {
      staleTime: Infinity,
    },
  });
  return {
    ...result,
    data: result.data && {
      decimals: result.data[0],
      name: result.data[1],
      symbol: result.data[2],
    },
  };
}

/**
 * Retrieves the token balance for a specific account.
 * @param token - The address of the token contract.
 * @param account - The address of the account to retrieve the balance for.
 * @returns The token balance for the specified account.
 */
export function useTokenBalance(token: Address, account: Address | undefined) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account || zeroAddress],
    query: {
      enabled: Boolean(account),
    },
  });
}

/**
 * Get the allowance of a token for a specific account and spender.
 *
 * @param token - The address of the token contract.
 * @param account - The address of the account for which to check the allowance.
 * @param spender - The address of the spender for which to check the allowance.
 * @returns The result of the `allowance` function call from the token contract.
 */
export function useAllowance(
  token: Address,
  account: Address | undefined,
  spender: Address | undefined
) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account || zeroAddress, spender || zeroAddress],
    query: {
      enabled: Boolean(account) && Boolean(spender),
    },
  });
}

/**
 * Simulate the `approve` function of an ERC20 token contract.
 *
 * @param token - The address of the ERC20 token.
 * @param spender - The address of the spender.
 * @param amount - The amount to be approved.
 * @returns The result of the `useSimulateContract` hook.
 */
export function useSimulateApprove(
  token: Address,
  spender: Address | undefined,
  amount: bigint | undefined
) {
  return useSimulateContract({
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender || zeroAddress, amount || 0n],
    query: {
      enabled: Boolean(spender) && amount !== undefined,
    },
  });
}
```

Now we'll just need a simple hook to get our current payment token address. Let's create one more module, `src/hooks/paymentToken.ts`:

```ts
import { Address } from "viem";
import { useAccount } from "wagmi";
import { paymentTokenAddress } from "../config";

export function usePaymentTokenAddress(): Address {
  const { chain } = useAccount();
  return paymentTokenAddress(chain);
}
```

Great, we have our hooks in place. Let's commit our changes:

```shell
git add .
git commit -m "Add hooks for getting contract data and simulating writes"
```
