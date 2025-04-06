"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendObscureTx = sendObscureTx;
const ethers_1 = require("ethers");
async function sendObscureTx({ rpcUrl, privateKey, to, valueEth, fake, nonce }) {
    const provider = new ethers_1.JsonRpcProvider(rpcUrl);
    const wallet = new ethers_1.Wallet(privateKey, provider);
    const value = (0, ethers_1.parseEther)(valueEth);
    const gasLimit = 21000n;
    const feeData = await provider.getFeeData();
    const fallbackPriority = 1500000000n; // 1.5 Gwei
    const fallbackMax = 5000000000n; // 5 Gwei
    const maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas ?? fallbackPriority) + 1000000000n;
    const maxFeePerGas = (feeData.maxFeePerGas ?? fallbackMax) + 2000000000n;
    const tx = {
        to,
        value,
        gasLimit,
        maxPriorityFeePerGas,
        maxFeePerGas,
        nonce,
        type: 2
    };
    const response = await wallet.sendTransaction(tx);
    const type = fake ? 'FAKE' : 'REAL';
    console.log(`TX (${type}) sent: ${response.hash}`);
    const receipt = await response.wait();
    console.log(`TX confirmed in block: ${receipt.blockNumber}`);
    return response;
}
