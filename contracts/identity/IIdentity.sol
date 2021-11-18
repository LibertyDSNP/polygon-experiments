//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IIdentity {
  function initialize(string memory _name) external;

  function name() external view returns (string memory);

  function version() external view returns (string memory);
}
