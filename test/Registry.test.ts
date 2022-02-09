import { expect } from "chai";
import { ethers } from "hardhat";
import { describe } from "mocha";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// https://ethereum-waffle.readthedocs.io/
describe("Registry", () => {
  const abiCoder = ethers.utils.defaultAbiCoder;

  let RegistryContract: ContractFactory;
  let registryInstance: Contract;

  before(async () => {
    RegistryContract = await ethers.getContractFactory("Registry");
    registryInstance = await RegistryContract.deploy();
    await registryInstance.deployed();
  });

  describe("deployment", () => {
    const registeredURI = "http://www.example.com";
    const handle = "Miguel";
    const expectedID = BigNumber.from(
      ethers.utils.keccak256(abiCoder.encode(["string"], [handle]))
    ).toString();

    it("can be deployed and used and emits the expected events", async () => {
      const [user] = await ethers.getSigners();
      const rcpt = await (
        await registryInstance.register(user.address, handle, registeredURI)
      ).wait();
      const events =
        rcpt?.events?.filter((x: any) => x.event === "RegisteredDNSPId") || [];
      expect(events.length).to.eq(1);

      const abi = [
        "event RegisteredDNSPId(uint256 indexed dsnpid, string indexed tokenURI)",
      ];
      const iface = new ethers.utils.Interface(abi);
      const res = iface.parseLog(events[0]);
      expect(res.args[0].toString()).to.eq(expectedID);

      const bytesURI = ethers.utils.toUtf8Bytes(registeredURI);
      expect(res.args[1].hash).to.eq(ethers.utils.keccak256(bytesURI));
    });
  });

  describe("ERC721 functions", () => {
    const registeredURI = "http://www.example2.com";
    const handle = "Julia";
    const expectedDSNPId = BigNumber.from(
      ethers.utils.keccak256(abiCoder.encode(["string"], [handle]))
    ).toString();

    let user: SignerWithAddress;
    let erc721StorageContract: Contract;
    let erc721Contract: Contract;

    before(async () => {
      [user] = await ethers.getSigners();
      // await expect(
      //   registryInstance.register(user.address, handle, registeredURI)
      // ).to.not.be.reverted;
      await expect(
        registryInstance.register(user.address, handle, registeredURI)
      )
        .to.emit(registryInstance, "RegisteredDNSPId")
        .withArgs(expectedDSNPId, registeredURI);
      erc721StorageContract = await ethers.getContractAt(
        "ERC721URIStorage",
        registryInstance.address
      );
      erc721Contract = await ethers.getContractAt(
        "ERC721",
        registryInstance.address
      );
    });

    it("returns correct tokenURI", async () => {
      // eslint-disable-next-line no-unused-expressions
      const actualURI = await erc721StorageContract.tokenURI(expectedDSNPId);
      expect(actualURI).to.eq(registeredURI);
    });

    it("returns correct owner", async () => {
      const actualOwner = await erc721Contract.ownerOf(expectedDSNPId);
      expect(actualOwner).to.eq(user.address);
    });

    it("can be transferred", async () => {
      const [newOwner] = await ethers.getSigners();
      // this mints the token.
      await expect(
        erc721Contract.transferFrom(
          user.address,
          newOwner.address,
          expectedDSNPId
        )
      ).to.not.be.reverted;
      const actualOwner = await erc721Contract.ownerOf(expectedDSNPId);
      expect(actualOwner).to.eq(user.address);
    });

    it("can be transferred to a smart contract that implements IERC721Receiver", async () => {
      const factory = await ethers.getContractFactory("DummyIdentityV2");
      const Dummy = await factory.deploy();

      // This mints the token.
      await expect(
        erc721Contract.transferFrom(user.address, Dummy.address, expectedDSNPId)
      ).to.not.be.reverted;

      const actualOwner = await erc721Contract.ownerOf(expectedDSNPId);
      expect(actualOwner).to.eq(Dummy.address);
    });

    it("cannot register identical handles under any conditions", async () => {
      const [anotherSigner] = await ethers.getSigners();
      await expect(
        registryInstance.register(user.address, handle, registeredURI)
      ).to.be.reverted;
      await expect(
        registryInstance.register(anotherSigner.address, handle, registeredURI)
      ).to.be.reverted;
      await expect(
        registryInstance.register(
          anotherSigner.address,
          handle,
          "http://www.placekitten.com"
        )
      ).to.be.reverted;
    });

    it("can register multiple DSNP Ids for the same user", async () => {
      await expect(
        registryInstance.register(
          user.address,
          "Nic",
          "http://placecage.com/800/600"
        )
      ).to.not.be.reverted;
    });
  });
  describe("Security", () => {
    it("cannot request a token for anyone but oneself", async () => {
      const nonSigner = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
      await expect(
        registryInstance.register(
          nonSigner,
          "Hello Kitty",
          "http://www.example.com"
        )
      ).to.be.revertedWith("Registry: caller is not recipient");
    });
  });
});
