# Our first test

Let's create a simple test suite for our contract. We can generate a scaffold using Foundry:

```shell
forge generate test --contract-name HelloPYUSD
```

Now go ahead and add our first test. The file will look like this:

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

If you're not already running a watched test, go ahead and start it, and verify that our test is bassing:

```shell
forge test -vw
```

Finally, let's commit our little test:

```shell
git add test/HelloPYUSD.t.sol
git commit -m 'add simple test of HelloPYUSD'
```
