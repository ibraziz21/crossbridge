

const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/bridge.sol/BridgeA.json");
const token = require('../artifacts/contracts/token.sol/bridgeToken.json');


// Ethereum configuration
const ethRPC = "https://testapi.mara.xyz/http";
const ethProvider = new ethers.providers.JsonRpcProvider(ethRPC);
const ethPrivateKey = "";
const ethWallet = new ethers.Wallet(ethPrivateKey, ethProvider);
const ethBridgeAddress = "0xF633993696540D0D120FFCae5385C4Deb5e5FD6a";
const ethBridgeContract = new ethers.Contract(ethBridgeAddress, abi, ethWallet);

// Polygon configuration
const polygonRPC = "https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ";
const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRPC);
const rKey = '';
const polygonWallet = new ethers.Wallet(rKey, polygonProvider);
const polygonBridgeAddress = "0xf891e8c207830A422a5dD868E82B47d749302987";
const polygonBridgeContract = new ethers.Contract(polygonBridgeAddress, abi, polygonWallet);

const reserves= new ethers.Wallet(rKey,polygonProvider)
const tokenAddress = "0x5fF20D86edBDFa4Feb827F042385DC88316EF714"
const tokenContract = new ethers.Contract(tokenAddress, token.abi,reserves)

// token reserve approval eth
const reservesEth= new ethers.Wallet(rKey,ethProvider)
const tknAddress = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"
const tknContract = new ethers.Contract(tknAddress, token.abi,reservesEth)

async function approve(){
  const amtToApprove = ethers.utils.parseEther('5000')

  await tokenContract.approve(ethBridgeAddress,amtToApprove);

  await tknContract.approve(polygonBridgeAddress, amtToApprove)
}

// Function to initiate bridging from Ethereum to Polygon
async function ethToPolygonBridge(sender, receiver, amount) {

  
  const ethReserves = await ethBridgeContract.bridgeTokens(amount);

  // Wait for the Ethereum reserves to be confirmed
  await ethReserves.wait();

  // Now initiate bridging from Polygon reserves to the receiver
  const polygonReserves = await polygonBridgeContract.bridgeTokens(amount, { gasLimit: 2000000 });
  const polygonReservesTx = await polygonReserves.wait();

  console.log("Bridging from Ethereum to Polygon completed.");
  console.log("Ethereum Reserves Transaction:", ethReserves.hash);
  console.log("Polygon Reserves Transaction:", polygonReservesTx.hash);
}

// Function to initiate bridging from Polygon to Ethereum
async function polygonToEthBridge(sender, receiver, amount) {

  const polygonReserves = await polygonBridgeContract.bridgeTokens(amount);

  // Wait for the Polygon reserves to be confirmed
  await polygonReserves.wait();

  // Now initiate bridging from Ethereum reserves to the receiver
  const ethReserves = await ethBridgeContract.bridgeTokens(amount, { gasLimit: 2000000 });
  const ethReservesTx = await ethReserves.wait();

  console.log("Bridging from Polygon to Ethereum completed.");
  console.log("Polygon Reserves Transaction:", polygonReserves.hash);
  console.log("Ethereum Reserves Transaction:", ethReservesTx.hash);
}

// Example usage
async function main() {
  const sender = ethWallet.address;
  const receiver = polygonWallet.address;
  const amount = ethers.utils.parseEther("1"); // Amount in Ether
  await approve()
  
  // Bridging from Ethereum to Polygon
  await ethToPolygonBridge(sender, receiver, amount);

  // Bridging from Polygon to Ethereum
  await polygonToEthBridge(sender, receiver, amount);
}

main();