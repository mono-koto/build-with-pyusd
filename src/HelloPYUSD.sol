// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC721} from "solmate/tokens/ERC721.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract HelloPYUSD is ERC721 {
    uint256 public totalIssued;

    ERC20 public immutable mintToken;
    uint256 public immutable mintPrice;

    constructor(address _mintToken, uint256 _mintPrice) ERC721("HelloPYUSD", "HIPYPL") {
        mintToken = ERC20(_mintToken);
        mintPrice = _mintPrice;
    }

    function mint() external {
        mintToken.transferFrom(msg.sender, address(this), mintPrice);
        _mint(msg.sender, ++totalIssued);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }
}
