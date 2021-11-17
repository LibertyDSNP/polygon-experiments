//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IIdentityProxy {
  function initialize(address _owner, address _beacon) external;
}
