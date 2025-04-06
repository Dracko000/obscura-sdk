import { JsonRpcProvider, Wallet, parseEther } from 'ethers'
import { SendObscureTxOptions, SentTxResult } from '../types'

export async function sendObscureTx({
  rpcUrl,
  privateKey,
  to,
  valueEth,
  fake,
  nonce,
}: SendObscureTxOptions): Promise<SentTxResult> {
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(privateKey, provider)

  const gasPrice = await provider.send('eth_gasPrice', [])

  const tx = {
    to,
    value: parseEther(valueEth),
    gasLimit: 21000,
    gasPrice,
    nonce,
  }

  const txResponse = await wallet.sendTransaction(tx)
  const label = fake ? 'FAKE' : 'REAL'
  console.log(`TX (${label}) sent: ${txResponse.hash}`)

  const receipt = await txResponse.wait()
  if (receipt) {
    console.log(`TX confirmed in block: ${receipt.blockNumber}`)
  }

  return {
    hash: txResponse.hash,
    blockNumber: receipt?.blockNumber ?? null,
  }
}
