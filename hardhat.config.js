require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
    hardhat: { 
      forking: {
        url: "https://eth-sepolia.g.alchemy.com/v2/Z60B8aMREX4qBnFu-s0e3QIGKW_YF8Op", // Replace with your Alchemy or other Ethereum node URL
    },
    accounts: [{
            privateKey: "0xf10e9070017e57f33a7e8a3ea0126a74868e92bc5779558a5af9c429300bd870", // Replace with your desired private key
            balance: "100000000000000000000", // 100 ETH in wei
        },
        {
            privateKey: "0x6649373d6e89340d2621d748d562525c3b6b01215eb9343d885f0116a3a029f9", // Replace with your desired private key
            balance: "100000000000000000000", // 100 ETH in wei
        }
    ],
    forking: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ", // Replace with your Alchemy or other Ethereum node URL
  },
  accounts: [{
          privateKey: "0xf10e9070017e57f33a7e8a3ea0126a74868e92bc5779558a5af9c429300bd870", // Replace with your desired private key
          balance: "100000000000000000000", // 100 ETH in wei
      },
      {
          privateKey: "0x6649373d6e89340d2621d748d562525c3b6b01215eb9343d885f0116a3a029f9", // Replace with your desired private key
          balance: "100000000000000000000", // 100 ETH in wei
      }
  ],
  },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/Z60B8aMREX4qBnFu-s0e3QIGKW_YF8Op`,
      accounts: [process.env.PRIVATE_KEY],
      balance: '1000000000000000'
      
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ',
      accounts: [process.env.PRIVATE_KEY],
      balance: '1000000000000000'
    },
},
  

}; 
