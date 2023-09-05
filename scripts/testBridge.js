const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/bridge.sol/BridgeA.json");
const token = require("../artifacts/contracts/token.sol/bridgeToken.json")


//const reserveWallet = /* Insert Address */ ''
const ethRPC = 'https://testapi.mara.xyz/http';
const ethProvider = new ethers.providers.JsonRpcProvider(ethRPC);

const polygonRPC = 'https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ';
const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRPC);

const rKey = 'db71b39375e0efaf240b24f89cb14d32d07c6679ea5a06ae4a52dc6ed806c401'
const reserves= new ethers.Wallet(rKey,polygonProvider)
const tokenAddress = "0x5fF20D86edBDFa4Feb827F042385DC88316EF714"
const tokenContract = new ethers.Contract(tokenAddress, token.abi,reserves)

// token reserve approval eth
const reservesEth= new ethers.Wallet(rKey,ethProvider)
const tknAddress = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"
const tknContract = new ethers.Contract(tknAddress, token.abi,reservesEth)

const reserveWallet = '0x34d235fC47593EA72A493804FEd11C1499A7826C'
const polygonBridgeAddress = '0xf891e8c207830A422a5dD868E82B47d749302987'
const ethBridgeAddress = '0xF633993696540D0D120FFCae5385C4Deb5e5FD6a'
//token for reserve approval polygon
//

async function approveToken(){
  const allowance = ethers.utils.parseEther("100"); // Amount in Ether

 
    await tokenContract.approve(polygonBridgeAddress, allowance)
    console.log('current allowance is: ', (await tokenContract.allowance(reserveWallet,polygonBridgeAddress)).toString())
  

 
    await tknContract.approve(ethBridgeAddress, allowance)
    console.log('current allowance is: ', (await tknContract.allowance(reserveWallet,ethBridgeAddress)).toString());
  

}

// Example usage
async function main() {
 

  approveToken()
  // Bridging from Ethereum to Polygon


}

main();
