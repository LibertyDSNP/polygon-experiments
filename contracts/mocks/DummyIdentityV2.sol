// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "../DSNPERC721Receiver.sol";

// This Dummy Identity contract can accept NFTs.
contract DummyIdentityV2 is DSNPERC721Receiver {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string private name = "";
    string private constant version = "v2";

    // An address type variable is used to store ethereum accounts.
    address public owner;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() {
        owner = msg.sender;
    }

    function initialize(string memory _name) public {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }
    function getVersion() public view returns (string memory) {
        //        console.log("getting version from DummyIdentityV2");
        return version;
    }
}




