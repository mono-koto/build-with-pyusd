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
