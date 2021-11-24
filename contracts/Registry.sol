// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IRegistry.sol";


contract Registry is IRegistry, Context, ERC721URIStorage {
    constructor() ERC721("DSNPRegistration", "DSNPR") {}


    function register(address _recipient, string memory handle, string memory _tokenURI)
    external
    override
    returns (uint256)
    {
        //  require(owner() == _msgSender(), "Ownable: caller is not the owner");
        require(_recipient == _msgSender(), "Registry: caller is not recipient");
        bytes32 hash = keccak256(abi.encode(handle));
        uint256 newItemId = uint256(hash);
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        emit RegisteredDNSPId(newItemId, _tokenURI);
        return newItemId;
    }
}
