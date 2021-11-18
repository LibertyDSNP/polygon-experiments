// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

interface IHandle {
    event RegisteredHandle(uint256 indexed handleId, string indexed handle);

    function create(address _recipient, string memory _handle) external;
}
