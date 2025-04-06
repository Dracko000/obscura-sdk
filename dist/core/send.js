"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendObscureTx = sendObscureTx;
const ethers_1 = require("ethers");
async function sendObscureTx({ rpcUrl, privateKey, to, valueEth, fake, nonce, }) {
    const provider = new ethers_1.JsonRpcProvider(rpcUrl);
    const wallet = new ethers_1.Wallet(privateKey, provider);
    const gasPrice = await provider.send('eth_gasPrice', []);
    const tx = {
        to,
        value: (0, ethers_1.parseEther)(valueEth),
        gasLimit: 21000,
        gasPrice,
        nonce,
    };
    const txResponse = await wallet.sendTransaction(tx);
    const label = fake ? 'FAKE' : 'REAL';
    console.log(`TX (${label}) sent: ${txResponse.hash}`);
    const receipt = await txResponse.wait();
    if (receipt) {
        console.log(`TX confirmed in block: ${receipt.blockNumber}`);
    }
    return {
        hash: txResponse.hash,
        blockNumber: receipt?.blockNumber ?? null,
    };
}
