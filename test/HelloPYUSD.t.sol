// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HelloPYUSD} from "../src/HelloPYUSD.sol";
import {MockPYUSD} from "./MockPYUSD.sol";

contract HelloPYUSDTest is Test {
    MockPYUSD public pyusd;
    HelloPYUSD public helloPYUSD;

    uint256 constant MINT_PRICE = 100e6;

    function setUp() public {
        pyusd = new MockPYUSD();
        helloPYUSD = new HelloPYUSD(address(pyusd), MINT_PRICE);
    }

    function testCreate() public {
        assertNotEq(address(helloPYUSD), address(0));
    }

    function testMint() public {
        pyusd.mint(address(this), MINT_PRICE);
        pyusd.approve(address(helloPYUSD), MINT_PRICE);

        helloPYUSD.mint();

        assertEq(pyusd.balanceOf(address(this)), 0);
        assertEq(pyusd.balanceOf(address(helloPYUSD)), MINT_PRICE);

        assertEq(helloPYUSD.balanceOf(address(this)), 1);
        assertEq(helloPYUSD.totalIssued(), 1);
    }

    function testFail_MintWithoutApproval() public {
        helloPYUSD.mint();
    }

    function testFail_MintWithInsufficientBalance() public {
        pyusd.approve(address(helloPYUSD), MINT_PRICE);
        helloPYUSD.mint();
    }
}
