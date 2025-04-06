import { JsonRpcProvider, Wallet } from 'ethers'
import { sendObscureTx } from './send'
import { randomBytes } from 'crypto'
import { CHAINS } from './chains'
import { GhostedTxOptions, GhostedTxResult, SentTxResult } from '../types'

export async function sendGhostedTx({
  chain,
  rpcUrl,
  privateKey,
  to,
  valueEth,
  fakeCount = 3,
  delayMs = 500,
  mode = 'serial',
}: GhostedTxOptions): Promise<GhostedTxResult> {
  const resolvedRpcUrl = chain ? CHAINS[chain]?.rpcUrl : rpcUrl
  if (!resolvedRpcUrl) throw new Error('No valid RPC URL provided')

  if (chain) console.log(`Sending ghosted transaction on ${CHAINS[chain].name}`)

  const provider = new JsonRpcProvider(resolvedRpcUrl)
  const wallet = new Wallet(privateKey, provider)

  let baseNonce = await wallet.getNonce('latest')

  const realTx = {
    rpcUrl: resolvedRpcUrl,
    privateKey,
    to,
    valueEth,
    fake: false,
    nonce: baseNonce,
  }

  const fakeTxs = Array.from({ length: fakeCount }).map((_, i) => ({
    rpcUrl: resolvedRpcUrl,
    privateKey,
    to: generateRandomAddress(),
    valueEth: '0',
    fake: true,
    nonce: baseNonce + i + 1,
  }))

  if (mode === 'parallel') {
    console.log('Sending REAL tx...')
    const realPromise = sendObscureTx(realTx)

    console.log(`Sending ${fakeCount} FAKE txs in parallel...`)
    const fakePromises = fakeTxs.map((tx, i) => {
      console.log(`Queued FAKE tx #${i + 1} to ${tx.to} with nonce ${tx.nonce}`)
      return sendObscureTx(tx)
    })

    const [realResult, ...fakeResults] = await Promise.all([realPromise, ...fakePromises])
    return { real: realResult, fakes: fakeResults }
  } else {
    console.log('Sending REAL tx...')
    const realResult = await sendObscureTx(realTx)

    const fakeResults: SentTxResult[] = []
    for (let i = 0; i < fakeCount; i++) {
      console.log(`Sending FAKE tx #${i + 1} to ${fakeTxs[i].to} with nonce ${fakeTxs[i].nonce}`)
      await delay(delayMs)
      const result = await sendObscureTx(fakeTxs[i])
      fakeResults.push(result)
    }

    return { real: realResult, fakes: fakeResults }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateRandomAddress(): string {
  return '0x' + randomBytes(20).toString('hex')
}
