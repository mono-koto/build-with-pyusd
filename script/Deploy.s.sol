// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {HelloPYUSD} from "../src/HelloPYUSD.sol";

contract Deploy is Script {
    uint256 public constant MINT_PRICE = 1e6;

    function run() public {
        address pyusd = vm.envAddress("PYUSD");
        vm.broadcast();
        new HelloPYUSD(pyusd, MINT_PRICE);
    }
}
