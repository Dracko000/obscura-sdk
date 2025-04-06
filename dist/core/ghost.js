"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGhostedTx = sendGhostedTx;
const ethers_1 = require("ethers");
const send_1 = require("./send");
const crypto_1 = require("crypto");
const chains_1 = require("./chains");
async function sendGhostedTx({ chain, rpcUrl, privateKey, to, valueEth, fakeCount = 3, delayMs = 500, mode = 'serial', }) {
    const resolvedRpcUrl = chain ? chains_1.CHAINS[chain]?.rpcUrl : rpcUrl;
    if (!resolvedRpcUrl)
        throw new Error('No valid RPC URL provided');
    if (chain)
        console.log(`Sending ghosted transaction on ${chains_1.CHAINS[chain].name}`);
    const provider = new ethers_1.JsonRpcProvider(resolvedRpcUrl);
    const wallet = new ethers_1.Wallet(privateKey, provider);
    let baseNonce = await wallet.getNonce('latest');
    const realTx = {
        rpcUrl: resolvedRpcUrl,
        privateKey,
        to,
        valueEth,
        fake: false,
        nonce: baseNonce,
    };
    const fakeTxs = Array.from({ length: fakeCount }).map((_, i) => ({
        rpcUrl: resolvedRpcUrl,
        privateKey,
        to: generateRandomAddress(),
        valueEth: '0',
        fake: true,
        nonce: baseNonce + i + 1,
    }));
    if (mode === 'parallel') {
        console.log('Sending REAL tx...');
        const realPromise = (0, send_1.sendObscureTx)(realTx);
        console.log(`Sending ${fakeCount} FAKE txs in parallel...`);
        const fakePromises = fakeTxs.map((tx, i) => {
            console.log(`Queued FAKE tx #${i + 1} to ${tx.to} with nonce ${tx.nonce}`);
            return (0, send_1.sendObscureTx)(tx);
        });
        const [realResult, ...fakeResults] = await Promise.all([realPromise, ...fakePromises]);
        return { real: realResult, fakes: fakeResults };
    }
    else {
        console.log('Sending REAL tx...');
        const realResult = await (0, send_1.sendObscureTx)(realTx);
        const fakeResults = [];
        for (let i = 0; i < fakeCount; i++) {
            console.log(`Sending FAKE tx #${i + 1} to ${fakeTxs[i].to} with nonce ${fakeTxs[i].nonce}`);
            await delay(delayMs);
            const result = await (0, send_1.sendObscureTx)(fakeTxs[i]);
            fakeResults.push(result);
        }
        return { real: realResult, fakes: fakeResults };
    }
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateRandomAddress() {
    return '0x' + (0, crypto_1.randomBytes)(20).toString('hex');
}
