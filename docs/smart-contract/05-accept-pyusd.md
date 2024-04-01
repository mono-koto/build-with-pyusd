# Accept PYUSD

We can now modify our free mint NFT so that it accepts PYUSD as payment.

## The PYUSD token

PYUSD is an ERC-20 token. As protocol developers, all we need to know is its address, and we can pull it in and use it just like any other ERC-20.

> [!NOTE] What is ERC-20
> Similar to the ERC-721 we're building in this walkthrough, an ERC-20 token adheres to certain interface and behaviors to define a _fungible_ token. ERC stands for "Ethereum Request for Comments" and is a process by which essential standards are defined.

Let's take note of the PYUSD addresses we'll need:

- Sepolia Testnet `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- Ethereum Mainnet `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`

## Mock token for testing

When writing unit tests, we don't have a deployed version of PYUSD in our test runner's simulated blockchain. We'll create a mock PYUSD for local tests. Create a `test/MockPYUSD.sol` file that inherits from solmate's ERC20:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ERC20} from "solmate/tokens/ERC20.sol";

contract MockPYUSD is ERC20 {

    constructor() ERC20("MockPYUSD", "mockPYUSD", 6) {}

    function mint(address to, uint256 value) public virtual {
        _mint(to, value);
    }
}
```

This is a simple ERC-20 contract that we can use to mint any number of tokens. We'll use this in our tests to simulate PYUSD.

> [!NOTE]
> For complex integrations, we can instead use forge's forking functionality to fork a live network, which lets us write our tests against the deployed contract logic and state.

Let's now commit our `MockPYUSD.sol` contract:

```shell
git add test/MockPYUSD.sol
git commit -m 'add MockPYUSD ERC-20 contract for local tests'
```

## How to accept PYUSD

Unlike native ETH values which can be specified as the `value` part of a call to a function, ERC-20s require a two step process to be transferred as part of contract calls:

1. Token holder _approves_ a spender (the contract) a maximum amount (allowance) available to be spent.
2. Token holder makes a call the spender, which then _transfers_ an amount from the holder.

> [!NOTE] "Pull" payments
> This pattern is sometimes referred to as _pull payments_; the payee _pulls_ the value from the payer.

## TDDing the payment process

We can modify our test so that our `testMint()` function checks the mint price and approves our mock PYUSD to be spent by the `mint()` function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HelloPYUSD} from "../src/HelloPYUSD.sol";
import {MockPYUSD} from "./MockPYUSD.sol"; // [!code highlight]

contract HelloPYUSDTest is Test {
    MockPYUSD public pyusd;  // [!code highlight]
    HelloPYUSD public helloPYUSD;

    uint256 constant MINT_PRICE = 100e6;

    function setUp() public {
        pyusd = new MockPYUSD();  // [!code highlight:2]
        helloPYUSD = new HelloPYUSD(address(pyusd), MINT_PRICE);
    }

    function testCreate() public {
        assertNotEq(address(helloPYUSD), address(0));
    }

    function testMint() public {
        pyusd.mint(address(this), MINT_PRICE);  // [!code highlight:2]
        pyusd.approve(address(helloPYUSD), MINT_PRICE);

        helloPYUSD.mint();

        assertEq(pyusd.balanceOf(address(this)), 0);  // [!code highlight:2]
        assertEq(pyusd.balanceOf(address(helloPYUSD)), MINT_PRICE);

        assertEq(helloPYUSD.balanceOf(address(this)), 1);
        assertEq(helloPYUSD.totalIssued(), 1);
    }
}
```

We're doing a few things here, and it's a bit too much to step though everything, but note that in our `setUp()` we're creating a `MockPYUSD` contract, and we're using its address to construct our `HelloPYUSD` contract, along with a new `MINT_PRICE`.

If we're running our tests – `forge test -vw` is pretty handy, right? – this change will break our build with a compile error. We're trying to call a non-existent `mintPrice()` function! So let's go fix up our contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC721} from "solmate/tokens/ERC721.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract HelloPYUSD is ERC721 {
    uint256 public totalIssued;

    ERC20 public immutable mintToken;
    uint256 public immutable mintPrice;  // [!code highlight]

    constructor(address _mintToken, uint256 _mintPrice) ERC721("HelloPYUSD", "HIPYPL") {  // [!code highlight]
        mintToken = ERC20(_mintToken);
        mintPrice = _mintPrice;  // [!code highlight]
    }

    function mint() external {
        mintToken.transferFrom(msg.sender, address(this), mintPrice);  // [!code highlight]
        _mint(msg.sender, ++totalIssued);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }
}
```

Now our tests should be passing again. Lovely!

> [!NOTE]
> The behavior of the ERC-20 token depends on how it is implemented. Correctly implemented ERC-20s will now allow insufficient balances to be spent, nor will allow spenders to go over their allowance.

While it's outside the purview of our own contract (and is the responsibility of PYUSD, which of course does everything correctly), if you want to see these error cases in action, you can add some failure tests:

```solidity
function testFail_MintWithoutApproval() public {
    helloPYUSD.mint();
}

function testFail_MintWithInsufficientBalance() public {
    pyusd.approve(address(helloPYUSD), MINT_PRICE);
    helloPYUSD.mint();
}
```

Let's commit our latest work here:

```shell
git commit -am 'accept ERC-20 token for mint payment'
```

## Who gets the PYUSD?

In the contract we've created, all the PYUSD is deposited to the contract itself. Once there, it's never usable for anything, so it's essentially locked away! There's currently no way for an actual human to receive it.

Let's fix this by letting an owner withdraw ETH and ERC-20s from this contract. In our tests, let's add failing tests:

```solidity
function testOwnerWithdrawToken() public {
    pyusd.mint(address(helloPYUSD), MINT_PRICE);
    helloPYUSD.withdrawToken(address(pyusd), address(this));
    assertEq(pyusd.balanceOf(address(this)), MINT_PRICE);
}

function testFail_nonOwnerWithdrawToken() public {
    vm.prank(address(0xabcd));
    helloPYUSD.withdrawToken(address(pyusd), address(this));
}

function testOwnerWithdraw() public {
    address recipient = address(0x1234);
    vm.deal(address(helloPYUSD), 1 ether);
    helloPYUSD.withdraw(recipient);
    assertEq(recipient.balance, 1 ether);
}

function testFail_nonOwnerWithdraw() public {
    vm.prank(address(0xabcd));
    helloPYUSD.withdraw(address(this));
}
```

These will break our build, so let's go ahead and implement `withdrawToken` and `withdraw`. First, import `Owned` and `SafeTransferLib` in our contract:

```solidity
import {Owned} from "solmate/auth/Owned.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
```

Now ensure we are inheriting from `Owned` and defaulting the owner to the contract deployer.

```solidity
contract HelloPYUSD is ERC721, Owned {
// ...

    constructor(address _mintToken, uint256 _mintPrice) ERC721("HelloPYUSD", "HIPYPL") Owned(msg.sender) {
        //...
    }
// ...
}
```

Finally, we'll add our withdraw functions:

```solidity
function withdrawToken(address token, address to) external onlyOwner {
    SafeTransferLib.safeTransfer(ERC20(token), to, ERC20(token).balanceOf(address(this)));
}

function withdraw(address to) external onlyOwner {
    SafeTransferLib.safeTransferETH(to, address(this).balance);
}
```

At this point, tests should be passing and we can commit:

```shell
git commit -am 'add withdraw functions'
```
