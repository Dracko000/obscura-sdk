#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const src_1 = require("./src");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const program = new commander_1.Command();
program
    .name('obscura')
    .description('Obscura CLI - Ghosted TX Protocol')
    .version('0.1.0');
program
    .command('tx:ghost')
    .description('Send real tx followed by fake tx(s)')
    .requiredOption('--to <address>', 'Receiver address')
    .requiredOption('--value <eth>', 'ETH to send')
    .option('--count <n>', 'Fake tx count', '2')
    .option('--mode <mode>', 'Send Mode: serial or parallel', 'serial')
    .option('--rpc <url>', 'RPC URL', process.env.RPC_URL)
    .option('--pk <key>', 'Private key', process.env.PRIVATE_KEY)
    .action(async (opts) => {
    const { to, value, count, rpc, pk } = opts;
    if (!rpc || !pk) {
        console.error('Missing RPC/PRIVATE_KEY. Provide via CLI or .env');
        process.exit(1);
    }
    await (0, src_1.sendGhostedTx)({
        rpcUrl: rpc,
        privateKey: pk,
        to,
        valueEth: value,
        fakeCount: parseInt(count),
        delayMs: 500
    });
});
program.parse(process.argv);
