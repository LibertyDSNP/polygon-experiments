// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

interface IRegistry {
    event RegisteredHandle(uint256 indexed dsnpid, string indexed tokenURI);

    function register(address _recipient, string memory _tokenURI)
    external
    returns (uint256);
}
