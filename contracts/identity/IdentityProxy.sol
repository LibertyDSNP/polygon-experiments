//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";

import "./IIdentityProxy.sol";

import "hardhat/console.sol";

contract IdentityProxy is Proxy, IIdentityProxy, Context {
  bytes32 internal constant _OWNER_SLOT =
    bytes32(uint256(keccak256("dsnp.org.owner")) - 1);

  bytes32 internal constant _BEACON_SLOT =
    bytes32(uint256(keccak256("eip1967.proxy.beacon")) - 1);

  constructor() payable {}

  function initialize(address _owner, address _beacon) public override {
    require(StorageSlot.getAddressSlot(_OWNER_SLOT).value == address(0), "");

    StorageSlot.getAddressSlot(_OWNER_SLOT).value = _owner;
    StorageSlot.getAddressSlot(_BEACON_SLOT).value = _beacon;
  }

  function _setBeacon(address newBeacon) private {
    require(
      Address.isContract(newBeacon),
      "ERC1967: new beacon is not a contract"
    );
    require(
      Address.isContract(IBeacon(newBeacon).implementation()),
      "ERC1967: beacon implementation is not a contract"
    );
    StorageSlot.getAddressSlot(_BEACON_SLOT).value = newBeacon;
  }

  function beacon() internal view virtual returns (address) {
    return StorageSlot.getAddressSlot(_BEACON_SLOT).value;
  }

  function _implementation() internal view virtual override returns (address) {
    return IBeacon(beacon()).implementation();
  }

  modifier onlyOwner() {
    require(owner() == msg.sender, "Ownable: caller is not the owner");
    _;
  }

  function owner() public view virtual returns (address) {
    return StorageSlot.getAddressSlot(_OWNER_SLOT).value;
  }

  function setBeacon(address newBeacon) public onlyOwner {
    _setBeacon(newBeacon);
  }
}
