// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  
  const approval = ethers.utils.parseEther("50000")
  const token = await hre.ethers.getContractFactory("bridgeToken");
  const Token = await token.deploy('0x11ec36418bE9a610904D1409EF0577b645104881')
  console.log("Contract deployed at: ", Token.address)

  await Token.mintToReserve(5000)
  await Token.mintToAddress('0x0ba94de3fe2ae3e298cd5c95880ef1abcc90a78d',100)

  console.log(await Token.balanceOf('0x11ec36418bE9a610904D1409EF0577b645104881'))


  const bridge = await hre.ethers.getContractFactory("BridgeA");
  const Bridge  = await bridge.deploy('0x11ec36418bE9a610904D1409EF0577b645104881',Token.address,4);
  console.log("Bridge deployed at: ", Bridge.address);

  await Token.approve(Bridge.address, approval)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
