import { JsonRpcProvider, Wallet, parseEther } from 'ethers'
import { CHAINS } from './chains'

interface BridgeTransferOptions {
  fromChain: keyof typeof CHAINS
  toChain: keyof typeof CHAINS
  privateKey: string
  to: string
  amountEth: string
}

export async function directBridgeTransfer({
  fromChain,
  toChain,
  privateKey,
  to,
  amountEth,
}: BridgeTransferOptions): Promise<{ fromHash: string; toHash: string }> {
  const fromRpc = CHAINS[fromChain].rpcUrl
  const toRpc = CHAINS[toChain].rpcUrl

  const fromProvider = new JsonRpcProvider(fromRpc)
  const toProvider = new JsonRpcProvider(toRpc)

  const walletFrom = new Wallet(privateKey, fromProvider)
  const walletTo = new Wallet(privateKey, toProvider)

  // Simulate burn/lock on source chain
  const fromTx = await walletFrom.sendTransaction({
    to: '0x000000000000000000000000000000000000dead',
    value: parseEther(amountEth),
  })

  console.log(`[${fromChain}] Locked: ${fromTx.hash}`)
  await fromTx.wait()

  // Simulate mint/unlock on destination chain
  const toTx = await walletTo.sendTransaction({
    to,
    value: parseEther(amountEth),
  })

  console.log(`[${toChain}] Minted: ${toTx.hash}`)
  await toTx.wait()

  return {
    fromHash: fromTx.hash,
    toHash: toTx.hash,
  }
}

export async function ghostCrosschainTransfer(options: BridgeTransferOptions) {
  console.log(`\n[Obscura GhostBridge] Simulating ghosted crosschain transfer...`)
  const result = await directBridgeTransfer(options)

  return {
    realTx: result.fromHash,
    fakeTx: result.toHash,
    fromChain: options.fromChain,
    toChain: options.toChain,
    amountEth: options.amountEth,
    receiver: options.to,
  }
}
