import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.6", settings: {} }],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: "auto",
      gasPrice: "auto",
    },
    localhost: {
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
      url: "http://127.0.0.1:1317",
      chainId: 137,
      // accounts: getAccounts("localhost"),
    },
    // chainstack labls uses chainid 80001
    mumbai: {
      chainId: 80001,
      gas: "auto",
      gasPrice: "auto",
      url: "https://rpc-mumbai.maticvigil.com",
      accounts:
        process.env.MUMBAI_PRIVATE_KEY !== undefined
          ? [process.env.MUMBAI_PRIVATE_KEY]
          : [],
    },
  },
  gasReporter: {
    enabled: process.env.SHOW_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
