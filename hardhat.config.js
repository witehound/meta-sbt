require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
    etworks: {
      hardhat: {
        web3Provider: {
          custom: {
            path: "http://localhost:8545",
            options: {
              chainId: 1337,
              hardfork: "istanbul",
              mnemonic:
                "test test test test test test test test test test test junk",
            },
            networkId: "*",
          },
        },
      },
    },
  },
};
