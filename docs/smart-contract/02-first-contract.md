# Solidity Contract

We already used Foundry to initialize our projects. Now we'll write some code.

## Create a new smart contract

Let's create a new smart contract file in our `src` directory. We'll name it `src/HelloPYUSD.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract HelloPYUSD {}
```

We're doing a few things in this little bit of code:

1. Specifying the license of our contract (we're using MIT here, but there are plenty of others to choose from; Use `UNLICENSED` if you prefer to not specify a license)
2. Specifying the solidity version. We're using `0.8.23` above.
3. Creating a totally empty smart contract.

Let's now check if it builds:

```shell
forge build
```

It should! If not, make sure you copied the above correctly. Once it's building, let's commit our code to git:

```shell
git add src/HelloPYUSD.sol
git commit -m "Create empty HelloPYUSD smart contract"
```
