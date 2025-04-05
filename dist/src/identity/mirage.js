"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMirageAddress = generateMirageAddress;
const ethers_1 = require("ethers");
function generateMirageAddress(seed) {
    const wallet = ethers_1.ethers.Wallet.createRandom();
    return wallet.address;
}
