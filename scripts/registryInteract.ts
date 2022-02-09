import * as dotenv from "dotenv";
import { ethers } from "hardhat";

const main = async () => {
  const registryAddr = "0x15c79f9a277A566F6800B0e7a9f42E5aCc103E97";
  const registryInstance = await ethers.getContractAt("Registry", registryAddr);

  const [signer] = await ethers.getSigners();
  console.log(signer.address);
  const userAddr = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
  const registrarPrivKey = process.env.MUMBAI_PRIVATE_KEY;

  console.log({ res });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
