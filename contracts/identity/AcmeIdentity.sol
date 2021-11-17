//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "./Identity.sol";

import "hardhat/console.sol";

contract AcmeIdentity is Identity {
  string private constant _VERSION = "Acme 1.0";

  function version() public pure override returns (string memory) {
    return _VERSION;
  }
}
