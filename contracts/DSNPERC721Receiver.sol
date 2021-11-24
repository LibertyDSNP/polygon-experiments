/// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract DSNPERC721Receiver is IERC721Receiver, Context {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
    external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
