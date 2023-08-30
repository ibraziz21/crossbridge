const {ethers} = require("ethers")
const {abi} = require("../artifacts/contracts/bridge.sol/BridgeA.json")
//const tokens = require("../artifacts/contracts/token.sol")
async function main() {

    const RPC1= "https://eth-sepolia.g.alchemy.com/v2/Z60B8aMREX4qBnFu-s0e3QIGKW_YF8Op"
    const provider1 = new ethers.providers.JsonRpcProvider(RPC1)
    const RPC2 = "https://polygon-mumbai.g.alchemy.com/v2/EiEk6hXCVsVB1cy6VIPlNdVaH8qNkCiZ"
    const provider2 = new ethers.providers.JsonRpcProvider(RPC2)
  
    const tokenEth = "0x9779b335b278d8E53F91f9D40210E7CbCb239fC2"
    const bridgeAddress = "0xF633993696540D0D120FFCae5385C4Deb5e5FD6a"


    const privateKey= "db71b39375e0efaf240b24f89cb14d32d07c6679ea5a06ae4a52dc6ed806c401"; // Replace with your private key

  const wallet1 = new ethers.Wallet(privateKey, provider1);
  const wallet2 = new ethers.Wallet(privateKey, provider2);

    const bEth = new ethers.Contract( bridgeAddress, abi, wallet1)
    const bPol =new ethers.Contract(bridgeAddress, abi,wallet2)

     const bridgeStart = await bEth.bridgeTokens(200)
      console.log("Init---------------")

      const transactionReceipt = await bridgeStart.wait();

  // Access the emitted events from the receipt
  const events = transactionReceipt.events;

  // Find the event named "TokensBridged"
  const tokensBridgedEvent = events.find(event => event.event === "BridgeInitiated");

  if (tokensBridgedEvent) {
    const sender = tokensBridgedEvent.args._initiator;
    const receiver = tokensBridgedEvent.args._recepient;
    const amount = tokensBridgedEvent.args._amountsent;
    const fees = tokensBridgedEvent.args._feePaid;

    console.log("Sender:", sender);
    console.log("Receiver:", receiver);
    console.log("Amount:", amount);

    await bPol.CompleteBridge(sender, receiver, amount);

    console.log("------Bridge Complete-------------")
  } else {
    console.log("TokensBridged event not found.");
  }
    }
    main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit();
    });
