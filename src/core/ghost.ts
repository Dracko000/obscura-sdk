import { JsonRpcProvider, Wallet } from 'ethers'
import { sendObscureTx } from './send'

interface GhostedTxOptions {
  rpcUrl: string
  privateKey: string
  to: string
  valueEth: string
  fakeCount?: number
  delayMs?: number
  mode?: 'serial' | 'parallel'
}

export async function sendGhostedTx({
  rpcUrl,
  privateKey,
  to,
  valueEth,
  fakeCount = 2,
  delayMs = 500,
  mode = 'serial',
}: GhostedTxOptions) {
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(privateKey, provider)

  let baseNonce = await wallet.getNonce('latest')

  const realTx = {
    rpcUrl,
    privateKey,
    to,
    valueEth,
    fake: false,
    nonce: baseNonce,
  }

  const fakeTxs = Array.from({ length: fakeCount }).map((_, i) => ({
    rpcUrl,
    privateKey,
    to,
    valueEth: '0',
    fake: true,
    nonce: baseNonce + i + 1,
  }))

  if (mode === 'parallel') {
    console.log('Sending REAL tx...')
    const realPromise = sendObscureTx(realTx)

    console.log(`Sending ${fakeCount} FAKE txs in parallel...`)
    const fakePromises = fakeTxs.map((tx, i) => {
      console.log(`Queued FAKE tx #${i + 1} with nonce ${tx.nonce}`)
      return sendObscureTx(tx)
    })

    await Promise.all([realPromise, ...fakePromises])
  } else {
    console.log('Sending REAL tx...')
    await sendObscureTx(realTx)

    for (let i = 0; i < fakeCount; i++) {
      console.log(`Sending FAKE tx #${i + 1} with nonce ${fakeTxs[i].nonce}...`)
      await delay(delayMs)
      await sendObscureTx(fakeTxs[i])
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
