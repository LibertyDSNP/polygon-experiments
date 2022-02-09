// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

interface IRegistry {
    event RegisteredDNSPId(uint256 indexed dsnpID, string indexed tokenURI);

    function register(address _recipient, string memory handle, string memory _tokenURI)
    external
    returns (uint256);
}
