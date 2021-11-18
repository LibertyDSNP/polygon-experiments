// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// This is the main building block for smart contracts.
contract DummyIdentityV2 is IERC721Receiver {
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

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
    external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}




