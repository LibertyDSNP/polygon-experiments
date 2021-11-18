//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "./IIdentity.sol";

import "hardhat/console.sol";

contract Identity is IIdentity, Context {
  string private constant _VERSION = "1.0";

  bytes32 internal constant _OWNER_SLOT =
    bytes32(uint256(keccak256("dsnp.org.owner")) - 1);

  bytes32 internal constant _IDENTITY_SLOT =
    bytes32(uint256(keccak256("dsnp.org.identity")) - 1);

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  struct IdentityStorage {
    string name;
  }

  constructor() {}

  function initialize(string memory _name) public override onlyOwner {
    setName(_name);
  }

  function identity() internal pure returns (IdentityStorage storage ds) {
    bytes32 position = _IDENTITY_SLOT;

    assembly {
      ds.slot := position
    }
  }

  function name() public view override returns (string memory) {
    return string(identity().name);
  }

  function setName(string memory _name) public onlyOwner {
    identity().name = _name;
  }

  modifier onlyOwner() {
    require(owner() == _msgSender(), "Ownable: caller is not the owner");
    _;
  }

  function setOwner(address _owner) public {
    // TODO secure/onlyOwner this

    StorageSlot.getAddressSlot(_OWNER_SLOT).value = _owner;
  }

  function owner() public view virtual returns (address) {
    return StorageSlot.getAddressSlot(_OWNER_SLOT).value;
  }

  function version() public pure virtual override returns (string memory) {
    return _VERSION;
  }
}
