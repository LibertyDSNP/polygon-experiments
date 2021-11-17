//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./IIdentity.sol";
import "./IIdentityProxy.sol";
import "./IdentityProxy.sol";

import "hardhat/console.sol";

contract IdentityFactory is Context {
  using Clones for address;

  address private immutable beacon;
  address private immutable proxy;

  constructor(address _beacon) {
    beacon = _beacon;
    proxy = address(new IdentityProxy());
  }

  event IdentityCreated(address addr);

  function createIdentity() public returns (address) {
    address instance = proxy.clone();

    IIdentityProxy(instance).initialize(_msgSender(), beacon);

    emit IdentityCreated(instance);

    return instance;
  }
}
