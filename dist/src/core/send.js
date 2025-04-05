"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendObscureTx = sendObscureTx;
const ethers_1 = require("ethers");
async function sendObscureTx({ rpcUrl, privateKey, to, valueEth, fake = false }) {
    const provider = new ethers_1.JsonRpcProvider(rpcUrl);
    const wallet = new ethers_1.Wallet(privateKey, provider);
    const txData = {
        to: fake ? wallet.address : to,
        value: fake ? 0n : (0, ethers_1.parseEther)(valueEth)
    };
    const tx = await wallet.sendTransaction(txData);
    console.log(`TX (${fake ? 'FAKE' : 'REAL'}) sent: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt) {
        console.log(`TX confirmed in block: ${receipt.blockNumber}`);
    }
    return receipt;
}
