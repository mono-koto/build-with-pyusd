# Our first test

Let's now create a simple test suite for our contract. We'll generate a scaffold using Foundry:

```shell
forge generate test --contract-name HelloPYUSD
```

Now we'll write our first test. The file will look like this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HelloPYUSD} from "../src/HelloPYUSD.sol";

contract HelloPYUSDTest is Test {
    HelloPYUSD public helloPYUSD;

    function setUp() public {
        helloPYUSD = new HelloPYUSD();
    }

    function testCreate() public {
        // Just a simple trivial test that the contract is created
        // We'll replace this later.
        assertNotEq(address(helloPYUSD), address(0));
    }
}
```

If not already running a watched test, let's go ahead and start that process:

```shell
forge test -vw
```

Once our test paseses, let's commit our work:

```shell
git add test/HelloPYUSD.t.sol
git commit -m 'add simple test of HelloPYUSD'
```
