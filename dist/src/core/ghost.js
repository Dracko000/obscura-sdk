"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGhostedTx = sendGhostedTx;
const send_1 = require("./send");
async function sendGhostedTx({ rpcUrl, privateKey, to, valueEth, fakeCount = 2, delayMs = 500 }) {
    console.log('Sending REAL tx...');
    await (0, send_1.sendObscureTx)({
        rpcUrl,
        privateKey,
        to,
        valueEth,
        fake: false
    });
    for (let i = 0; i < fakeCount; i++) {
        console.log(`Sending FAKE tx #${i + 1}...`);
        await delay(delayMs);
        await (0, send_1.sendObscureTx)({
            rpcUrl,
            privateKey,
            to,
            valueEth: '0',
            fake: true
        });
    }
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
