// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC721} from "solmate/tokens/ERC721.sol";

contract HelloPYUSD is ERC721 {
    uint256 public totalIssued;

    constructor() ERC721("HelloPYUSD", "HIPYPL") {}

    function mint() external {
        _mint(msg.sender, ++totalIssued);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return "";
    }
}
