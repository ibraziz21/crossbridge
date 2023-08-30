const Web3 = require("web3");
const bridge = require("../artifacts/contracts/bridge.sol")
const tokens = require("../artifacts/contracts/token.sol")
async function main() {

    const RPC1= new Web3("https://eth-sepolia.g.alchemy.com/v2/Z60B8aMREX4qBnFu-s0e3QIGKW_YF8Op")
    const RPC2 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ")
  
    const tokenEth = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"
    const tokenPol = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"

    const bridge ="0xF633993696540D0D120FFCae5385C4Deb5e5FD6a"

    const owner = process.env.PRIVATE_KEY

    const bridgeEth = new RPC1.eth.Contract(
        BridgeEth.abi
      );
      
      const bridgeBsc = new RPC2.eth.Contract(
        BridgeBsc.abi
      );

      await bridgeEth.bridgeTokens(200)
      console.log("Init")
      
      bridgeEth.events.Transfer(
        {fromBlock: 0, step: 0}
      ).on('data', async event => {
        const { from, to, amount, date, nonce } = event.returnValues;
      
        const tx = bridgeBsc.methods.mint(to, amount, nonce);
        const [gasPrice, gasCost] = await Promise.all([
          web3Bsc.eth.getGasPrice(),
          tx.estimateGas({from: admin}),
        ]);
        const data = tx.encodeABI();
        const txData = {
          from: admin,
          to: bridgeBsc.options.address,
          data,
          gas: gasCost,
          gasPrice
        };
        const receipt = await web3Bsc.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
          Processed transfer:
          - from ${from} 
          - to ${to} 
          - amount ${amount} tokens
          - date ${date}
        `);
      });
