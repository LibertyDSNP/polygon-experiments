import { expect } from "chai";
import { ethers } from "hardhat";
import { describe } from "mocha";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import exp from "constants";
import { keccak256 } from "ethers/lib/utils";

describe("Registry", () => {
  const registeredURI = "http://www.example.com";
  let HandleContract: ContractFactory;
  let handleInstance: Contract;

  before(async () => {
    HandleContract = await ethers.getContractFactory("Registry");
    handleInstance = await HandleContract.deploy();
  });

  describe("deployment", () => {
    it("can be deployed and used and emits the expected events", async () => {
      const [user] = await ethers.getSigners();
      const rcpt = await (
        await handleInstance.register(user.address, registeredURI)
      ).wait();
      const events =
        rcpt?.events?.filter((x: any) => x.event === "RegisteredHandle") || [];
      expect(events.length).to.eq(1);

      const abi = [
        "event RegisteredHandle(uint256 indexed dsnpid, string indexed tokenURI)",
      ];
      const iface = new ethers.utils.Interface(abi);
      const res = iface.parseLog(events[0]);
      expect(res.args[0].toString()).to.eq("1000");

      const bytesURI = ethers.utils.toUtf8Bytes(registeredURI);
      expect(res.args[1].hash).to.eq(ethers.utils.keccak256(bytesURI));
    });
  });

  describe("ERC721 functions", () => {
    let user: SignerWithAddress;
    let erc721StorageContract: Contract;
    let erc721Contract: Contract;
    const expectedDSNPId = 1000;

    before(async () => {
      [user] = await ethers.getSigners();
      await expect(handleInstance.register(user.address, registeredURI)).to.not
        .be.reverted;
      erc721StorageContract = await ethers.getContractAt(
        "ERC721URIStorage",
        handleInstance.address
      );
      erc721Contract = await ethers.getContractAt(
        "ERC721",
        handleInstance.address
      );
    });

    it("returns correct tokenURI", async () => {
      // eslint-disable-next-line no-unused-expressions
      const actualURI = await erc721StorageContract.tokenURI(expectedDSNPId);
      expect(actualURI).to.eq(registeredURI);
    });

    it("retuns correct owner", async () => {
      const actualOwner = await erc721Contract.ownerOf(expectedDSNPId);
      expect(actualOwner).to.eq(user.address);
    });

    it("can be transferred", async () => {
      const [newOwner] = await ethers.getSigners();
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
      await expect(
        erc721Contract.transferFrom(user.address, Dummy.address, expectedDSNPId)
      ).to.not.be.reverted;

      const actualOwner = await erc721Contract.ownerOf(expectedDSNPId);
      expect(actualOwner).to.eq(Dummy.address);
    });
  });
});
