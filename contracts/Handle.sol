// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IHandle.sol";

contract Handle is IHandle, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private handleIds;

    constructor() ERC721("DSNPHandle", "DSNPH") {
        handleIds._value = 9999;
    }

    // recipient is the Identity proxy clone address and is the owner of the DSNP id
    // that would be associated with this handle.
    function create(address _recipient, string memory _handle) external override {
        handleIds.increment();
        uint256 newItemId = handleIds.current();
        _mint(_recipient, newItemId);
        emit RegisteredHandle(newItemId, _handle);
    }
}
