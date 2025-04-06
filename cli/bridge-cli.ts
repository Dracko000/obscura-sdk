#!/usr/bin/env ts-node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { ethers } from 'ethers'
import { CHAINS } from '../src/core/chains'
import { directBridgeTransfer } from '../src/core/bridge'

const argv = yargs(hideBin(process.argv))
  .option('from', {
    type: 'string',
    demandOption: true,
    describe: 'Source chain key (e.g., scrollSepolia)',
  })
  .option('to', {
    type: 'string',
    demandOption: true,
    describe: 'Destination chain key (e.g., baseSepolia)',
  })
  .option('pk', {
    type: 'string',
    demandOption: true,
    describe: 'Private key for the sender wallet',
  })
  .option('toAddress', {
    type: 'string',
    demandOption: true,
    describe: 'Recipient address',
  })
  .option('amount', {
    type: 'string',
    demandOption: true,
    describe: 'Amount in ETH (e.g., 0.01)',
  })
  .option('dryRun', {
    type: 'boolean',
    default: false,
    describe: 'Estimate gas and costs without sending transactions',
  })
  .parseSync()

async function main() {
  const fromChainKey = argv.from
  const toChainKey = argv.to
  const amountEth = argv.amount
  const toAddress = argv.toAddress

  const fromChain = CHAINS[fromChainKey as keyof typeof CHAINS]
  const toChain = CHAINS[toChainKey as keyof typeof CHAINS]

  if (!fromChain) throw new Error(`Unknown source chain: ${fromChainKey}`)
  if (!toChain) throw new Error(`Unknown destination chain: ${toChainKey}`)
  if (!ethers.isAddress(toAddress)) throw new Error(`Invalid recipient address: ${toAddress}`)

  const provider = new ethers.JsonRpcProvider(fromChain.rpcUrl)
  const wallet = new ethers.Wallet(argv.pk, provider)
  const value = ethers.parseEther(amountEth)

  const gasPrice = BigInt(await provider.send('eth_gasPrice', []))
  const estimatedGas = await provider.estimateGas({
    from: wallet.address,
    to: toAddress,
    value,
  })

  const gasCost = gasPrice * estimatedGas
  const totalCost = gasCost + value
  const balance = await provider.getBalance(wallet.address)

  console.log(`\n=== Estimasi ===`)
  console.log(`From: ${wallet.address}`)
  console.log(`To: ${toAddress}`)
  console.log(`Value: ${value} wei`)
  console.log(`Gas Price: ${gasPrice} wei`)
  console.log(`Estimated Gas: ${estimatedGas}`)
  console.log(`Gas Cost: ${gasCost} wei`)
  console.log(`Total Required: ${totalCost} wei`)
  console.log(`Current Balance: ${balance} wei (${ethers.formatEther(balance)} ETH)`)
  console.log(`Enough Balance: ${balance >= totalCost}\n`)

  if (argv.dryRun) {
    console.log('Dry run enabled — transaction not broadcasted.')
    return
  }

  if (balance < totalCost) {
    console.error(`Insufficient balance to perform transaction.`)
    process.exit(1)
  }

  console.log(`Sending ${amountEth} ETH from ${fromChain.name} to ${toChain.name}...`)

  try {
    const txResult = await directBridgeTransfer({
      fromChain: fromChainKey as any,
      toChain: toChainKey as any,
      privateKey: argv.pk,
      to: toAddress,
      amountEth,
    })

    console.log(`\nTransactions submitted:`)
    console.log(`  Real TX:  ${txResult.fromHash}`)
    console.log(`  Dummy TX: ${txResult.toHash}`)
  } catch (err) {
    console.error(`Bridge transaction failed:\n`, err)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unhandled Error:', err)
  process.exit(1)
})
