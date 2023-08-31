const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/bridge.sol/BridgeA.json");
const token = require("../artifacts/contracts/token.sol/bridgeToken.json")


const reserveWallet = /* Insert Address */ ''

// Ethereum configuration
const ethRPC = "https://eth-sepolia.g.alchemy.com/v2/API--KEY";
const ethProvider = new ethers.providers.JsonRpcProvider(ethRPC);
const ethPrivateKey = '';
const ethWallet = new ethers.Wallet(ethPrivateKey, ethProvider);
const ethBridgeAddress = "0xF633993696540D0D120FFCae5385C4Deb5e5FD6a";
const ethBridgeContract = new ethers.Contract(ethBridgeAddress, abi, ethWallet);


// Polygon configuration
const polygonRPC = "https://polygon-mumbai.g.alchemy.com/v2/API--KEY";
const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRPC);
const polygonPrivateKey = '';
const polygonWallet = new ethers.Wallet(polygonPrivateKey, polygonProvider);
const polygonBridgeAddress = "";
const polygonBridgeContract = new ethers.Contract(polygonBridgeAddress, abi, polygonWallet);

//token for reserve approval polygon
const rKey = ''
const reserves= new ethers.Wallet(rKey,polygonProvider)
const tokenAddress = ""
const tokenContract = new ethers.Contract(tokenAddress, token.abi,reserves)

// token reserve approval eth
const reservesEth= new ethers.Wallet(rKey,ethProvider)
const tknAddress = ""
const tknContract = new ethers.Contract(tknAddress, token.abi,reservesEth)

async function approveToken(){
  const allowance = ethers.utils.parseEther("100"); // Amount in Ether

  if(await tokenContract.allowance(reserveWallet, polygonBridgeAddress) == 0){
    await tokenContract.approve(polygonBridgeAddress, allowance)
  }

  if(await tknContract.allowance(reserveWallet, ethBridgeAddress) == 0){
    await tknContract.approve(ethBridgeAddress, allowance)
  }

}

// Function to initiate bridging from Ethereum to Polygon
async function ethToPolygonBridge(sender, receiver, amount) {
  const ethReserves = await ethBridgeContract.bridgeTokens(amount);

  // Wait for the Ethereum reserves to be confirmed
  await ethReserves.wait();

  // Now initiate bridging from Polygon reserves to the receiver
  const polygonReserves = await polygonBridgeContract.CompleteBridge(sender, receiver, amount, { gasLimit: 2000000 });
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
  const ethReserves = await ethBridgeContract.CompleteBridge(amount, { gasLimit: 2000000 });
  await ethReserves.wait();

  console.log("Bridging from Polygon to Ethereum completed.");
  console.log("Polygon Reserves Transaction:", polygonReserves.hash);
  console.log("Ethereum Reserves Transaction:", ethReserves.hash);
}

// Example usage
async function main() {
  const sender = ethWallet.address;
  const receiver = polygonWallet.address;
  const amount = ethers.utils.parseEther("1"); // Amount in Ether

  approveToken()
  // Bridging from Ethereum to Polygon

  await ethToPolygonBridge(sender, receiver, amount);

  // Bridging from Polygon to Ethereum
  await polygonToEthBridge(sender, receiver, amount);
}

main();
