# Turn HelloPYUSD into an NFT

You've probably heard of NFTs! Well, now we're going to write an NFT smart contract that accepts PYUSD as payment.

Most NFTs on Ethereum adhere to the ERC-721 standard, meaning that the smart contract must have specific functions with specific behaviors.

> [!NOTE] What is ERC-721?
> ERC stands for "Ethereum Request for Comments" and is a process by which essential standards are defined. An ERC-721 token is a non-fungible token (NFT) that adheres to a specific interface and behaviors. Being non-fungible, each token has a unique ID that makes it distinct from all other tokens.

## Implementation

We're going to inherit from an audited, minimal ERC-721 solidity implementation from the [solmate project](https://github.com/transmissions11/solmate).

We'll add the dependency via forge:

```shell
$ forge install transmissions11/solmate
```

The above uses git submodules to pull the dependency into our `lib` directory, and it commits the addition.

We can now integrate the solmate ERC721 contract into our project:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC721} from "solmate/tokens/ERC721.sol";

contract HelloPYUSD is ERC721 {
    uint256 public totalIssued;

    constructor() ERC721("HelloPYUSD", "HIPYPL") {}

    function mint() external {
        _mint(msg.sender, ++totalIssued);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }
}
```

In the above, we:

1. Import `ERC721` contract, which we inherit from.
2. Add storage for `totalIssued` to keep track of the count.
3. Adjust our constructor to call the `ERC721` constructor to set our NFT's name to `Hello PYUSD` and its symbol to `HIPYPL`.
4. Add a `mint` function that lets the caller mint the next ID, incrementing `totalIssued`.
5. Implement the abstract `tokenURI` function to just return an empty string (for now).

Notice we are not yet accepting payment! That's ok, we'll get there.

## Testing our mint function

Let's go back to our tests and add some testing of our new mint function by adding the following to our test file:

```solidity
function testMint() public {
    helloPYUSD.mint();
    assertEq(helloPYUSD.balanceOf(address(this)), 1);
    assertEq(helloPYUSD.totalIssued(), 1);
}
```

We are ensuring that the balance of the caller – `address(this)` – is `1`, and the `totalIssued()` is also `1`. Yay, so far so good!

Let's commit our work:

```shell
git add src/HelloPYUSD.sol test/HelloPYUSD.t.sol
git commit -m 'Turn HelloPYUSD into an NFT'
```
