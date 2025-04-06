Obscura SDK

**Client-side Obscura Protocol for Transaction Ghosting.**
Send a real Ethereum transaction with N dummy transactions to obscure intent, sequence, and origin.

## Features

- Ghosted transaction protocol (real + fake txs)
- Supports serial or parallel sending
- Designed for privacy-enhancing wallet/dApp integration
- Works on EVM-compatible chains

## Install

```bash
npx tsx cli.ts tx:ghost \
  --rpc https://scroll-sepolia.infura.io/v3/... \ <RPC URL>
  --key 0x... \ <Private Key>
  --to 0x... \ <Address Target>
  --value 0.001 \ <Value>
  --fake 3 \ <Dummy>
  --mode parallel or serial <mode>
```
Update !!!
Obscura SDK v0.3.0

Obscura SDK now supports Crosschain Ghosted Transactions — allowing you to send a real transaction on one chain and a fake transaction on another without using any smart contract or bridge.

New Feature: directBridgeTransfer

This new method enables a lightweight crosschain transaction simulation:
```bash
import { directBridgeTransfer } from 'obscura-sdk'

const result = await directBridgeTransfer({
  fromChain: 'scrollSepolia',
  toChain: 'sepolia',
  privateKey: '0xabc...',
  to: '0xReceiverAddress',
  amountEth: '0.001',
})

console.log('Real TX Hash:', result.fromHash)
console.log('Fake TX Hash:', result.toHash)
```
Supported Testnets

Scroll Sepolia

Base Sepolia

Polygon Amoy

Ethereum Sepolia


> Note: No relayers, smart contracts, or bridges are required. This is a direct RPC-based ghosting protocol.

