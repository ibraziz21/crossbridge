require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
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
    mara: {
      url: 'https://testapi.mara.xyz/http',
      accounts: [process.env.PRIVATE_KEY],
      balance: '1000000000000000'
    },
},
  

}; 
