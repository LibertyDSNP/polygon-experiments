//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";

import "hardhat/console.sol";

contract IdentityBeacon is UpgradeableBeacon {
  constructor(address _implementation) UpgradeableBeacon(_implementation) {}
}
