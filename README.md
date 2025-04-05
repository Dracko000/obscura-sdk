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
