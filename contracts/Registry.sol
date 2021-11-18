// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IRegistry.sol";


contract Registry is IRegistry, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private dsnpIds;

    constructor() ERC721("DSNPHandle", "DSNPH") {
        dsnpIds._value = 999;
    }

    function register(address _recipient, string memory _tokenURI)
    external
    override
    returns (uint256)
    {
        dsnpIds.increment();
        uint256 newItemId = dsnpIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        emit RegisteredHandle(newItemId, _tokenURI);
        return newItemId;
    }
}
