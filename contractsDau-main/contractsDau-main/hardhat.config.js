require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    polygonMumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/IqzQnrs653IZafcYRxu894cvMbGdVO7x",
      accounts: [
        "1b4d3607d9252d0ed0b4fe86f529dcfb272f0fbcca7636ef301c9d0b3acff06f",
      ],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "ND7X43DG95PBS5RP4A88N9CPR3XKPUXWW9",
    },
  },
};
