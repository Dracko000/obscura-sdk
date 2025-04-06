"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGhostedTx = sendGhostedTx;
const ethers_1 = require("ethers");
const send_1 = require("./send");
async function sendGhostedTx({ rpcUrl, privateKey, to, valueEth, fakeCount = 2, delayMs = 500, mode = 'serial', }) {
    const provider = new ethers_1.JsonRpcProvider(rpcUrl);
    const wallet = new ethers_1.Wallet(privateKey, provider);
    let baseNonce = await wallet.getNonce('latest');
    const realTx = {
        rpcUrl,
        privateKey,
        to,
        valueEth,
        fake: false,
        nonce: baseNonce,
    };
    const fakeTxs = Array.from({ length: fakeCount }).map((_, i) => ({
        rpcUrl,
        privateKey,
        to,
        valueEth: '0',
        fake: true,
        nonce: baseNonce + i + 1,
    }));
    if (mode === 'parallel') {
        console.log('Sending REAL tx...');
        const realPromise = (0, send_1.sendObscureTx)(realTx);
        console.log(`Sending ${fakeCount} FAKE txs in parallel...`);
        const fakePromises = fakeTxs.map((tx, i) => {
            console.log(`Queued FAKE tx #${i + 1} with nonce ${tx.nonce}`);
            return (0, send_1.sendObscureTx)(tx);
        });
        await Promise.all([realPromise, ...fakePromises]);
    }
    else {
        console.log('Sending REAL tx...');
        await (0, send_1.sendObscureTx)(realTx);
        for (let i = 0; i < fakeCount; i++) {
            console.log(`Sending FAKE tx #${i + 1} with nonce ${fakeTxs[i].nonce}...`);
            await delay(delayMs);
            await (0, send_1.sendObscureTx)(fakeTxs[i]);
        }
    }
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
