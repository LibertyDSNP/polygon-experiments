import { expect } from "chai";
import { ethers } from "hardhat";
import { describe } from "mocha";

describe("Registry", () => {
  it("can be deployed and used and emits the expected events", async () => {
    const [user] = await ethers.getSigners();
    const HandleContract = await ethers.getContractFactory("Registry");
    const handleInstance = await HandleContract.deploy();

    const registeredURI = "http://www.example.com";

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

  it("can return tokenURI", async () => {});
});
