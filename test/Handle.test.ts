import { expect } from "chai";
import { ethers } from "hardhat";
import { describe } from "mocha";
import { Contract, ContractFactory } from "ethers";
import { parseEventLogArgs } from "./helpers";

describe("Handle", () => {
  let HandleContract: ContractFactory;
  let handleInstance: Contract;

  before(async () => {
    HandleContract = await ethers.getContractFactory("Handle");
    handleInstance = await HandleContract.deploy();
    await handleInstance.deployed();
  });

  describe("deployment", () => {
    it("can be deployed and used and emits the expected events", async () => {
      const registeredHandle = "Barbie";
      const [user] = await ethers.getSigners();
      const rcpt = await (
        await handleInstance.create(user.address, registeredHandle)
      ).wait();
      const events =
        rcpt?.events?.filter((x: any) => x.event === "RegisteredHandle") || [];
      expect(events.length).to.eq(1);

      const abi = [
        "event RegisteredHandle(uint256 indexed dsnpid, string indexed handle)",
      ];
      const eventArgs = parseEventLogArgs(events, 0, abi);
      expect(eventArgs[0].toString()).to.eq("10000");

      const bytesURI = ethers.utils.toUtf8Bytes(registeredHandle);
      expect(eventArgs[1].hash).to.eq(ethers.utils.keccak256(bytesURI));
    });
  });
});
