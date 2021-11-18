import { expect } from "chai";
import { ethers } from "hardhat";

export const parseEventLogArgs = (
  logEvents: Array<any>,
  logIndex: number,
  abi: Array<string>
) => {
  expect(logEvents.length).to.be.greaterThan(logIndex);
  const iface = new ethers.utils.Interface(abi);
  return iface.parseLog(logEvents[0]).args;
};
