const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/token.sol/bridgeToken.json")

async function main() {

    const RPC = "http://127.0.0.1:8545"
    const provider = new ethers.providers.JsonRpcProvider(RPC)

    let wallet = new ethers.Wallet("f10e9070017e57f33a7e8a3ea0126a74868e92bc5779558a5af9c429300bd870", provider)
    let contractaddress = "0x6AD15a3EF3583cA2482642242A46D53ba63f5827"
    let Receiver = "0x11ec36418be9a610904d1409ef0577b645104881"

    const contract = new ethers.Contract(contractaddress, abi, provider)
   // const bal = await contract.balanceOf(Receiver);
   console.log("Passes")
   let X= await contract.balanceOf(Receiver)
   console.log(X)


    const balanceWei = await provider.getBalance(wallet.address);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    console.log("ETH balance of Deployer(Output Tax Receiver): ", balanceEth)


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit();
    });

