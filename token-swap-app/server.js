const express = require('express');
const { ethers } = require('ethers');
const bodyParser = require('body-parser');
const { abi } = require('../artifacts/contracts/bridge.sol/BridgeA.json');
const token = require('../artifacts/contracts/token.sol/bridgeToken.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Ethereum configuration
const ethRPC = 'https://testapi.mara.xyz/http';
const ethProvider = new ethers.providers.JsonRpcProvider(ethRPC);
const ethPrivateKey = 'db71b39375e0efaf240b24f89cb14d32d07c6679ea5a06ae4a52dc6ed806c401';
const ethWallet = new ethers.Wallet(ethPrivateKey, ethProvider);
const ethBridgeAddress = '0xF633993696540D0D120FFCae5385C4Deb5e5FD6a';
const ethBridgeContract = new ethers.Contract(ethBridgeAddress, abi, ethWallet);

// Polygon configuration
const polygonRPC = 'https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ';
const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRPC);
const polygonPrivateKey = 'db71b39375e0efaf240b24f89cb14d32d07c6679ea5a06ae4a52dc6ed806c401';
const polygonWallet = new ethers.Wallet(polygonPrivateKey, polygonProvider);
const polygonBridgeAddress = '0xf891e8c207830A422a5dD868E82B47d749302987';
const polygonBridgeContract = new ethers.Contract(polygonBridgeAddress, abi, polygonWallet);

const rKey = 'db71b39375e0efaf240b24f89cb14d32d07c6679ea5a06ae4a52dc6ed806c401'
const reserves= new ethers.Wallet(rKey,polygonProvider)
const tokenAddress = "0x5fF20D86edBDFa4Feb827F042385DC88316EF714"
const tokenContract = new ethers.Contract(tokenAddress, token.abi,reserves)

// token reserve approval eth
const reservesEth= new ethers.Wallet(rKey,ethProvider)
const tknAddress = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"
const tknContract = new ethers.Contract(tknAddress, token.abi,reservesEth)

const reserveWallet = '0x11ec36418be9a610904d1409ef0577b645104881'

// ... Other configurations and functions ...


// Define API routes
app.post('/eth-to-polygon-bridge', async (req, res) => {
 
    res.send('Ethereum to Polygon bridge initiated.');
    const amount = req.body.amount;
    console.log("Amount: ", amount);
    const ethReserves = await ethBridgeContract.bridgeTokens(amount);

    // Wait for the Ethereum reserves to be confirmed
    await ethReserves.wait();
  
    // Now initiate bridging from Polygon reserves to the receiver
    const polygonReserves = await polygonBridgeContract.CompleteBridge(sender, receiver, amount, { gasLimit: 2000000 });
    const polygonReservesTx = await polygonReserves.wait();
  
    console.log("Bridging from Ethereum to Polygon completed.");
    console.log("Ethereum Reserves Transaction:", ethReserves.hash);
    console.log("Polygon Reserves Transaction:", polygonReservesTx.hash);

 
});

app.post('/polygon-to-eth-bridge', async (req, res) => {
   
    res.send('Polygon to Ethereum bridge initiated.');
    console.log(req.body.amount)
    const amount = req.body.amount;
    const polygonReserves = await polygonBridgeContract.bridgeTokens(amount);

    // Wait for the Polygon reserves to be confirmed
    await polygonReserves.wait();
  
    // Now initiate bridging from Ethereum reserves to the receiver
    const ethReserves = await ethBridgeContract.CompleteBridge(amount, { gasLimit: 2000000 });
    await ethReserves.wait();
  
    console.log("Bridging from Polygon to Ethereum completed.");
    console.log("Polygon Reserves Transaction:", polygonReserves.hash);
    console.log("Ethereum Reserves Transaction:", ethReserves.hash);


  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
