// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Renderer} from "../src/Renderer.sol";

contract RendererTest is Test {
    function testTokenId() public {
        // console.log(Renderer.tokenURI(123));
        assertNotEq(Renderer.tokenURI(3), "");
    }
}
