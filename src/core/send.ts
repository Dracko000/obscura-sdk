import { JsonRpcProvider, Wallet, parseEther } from 'ethers'

interface SendObscureTxOptions {
  rpcUrl: string
  privateKey: string
  to: string
  valueEth: string
  fake: boolean
  nonce?: number
}

export async function sendObscureTx({
  rpcUrl,
  privateKey,
  to,
  valueEth,
  fake,
  nonce
}: SendObscureTxOptions) {
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(privateKey, provider)

  const value = parseEther(valueEth)
  const gasLimit = 21_000n

  const feeData = await provider.getFeeData()

  const fallbackPriority = 1_500_000_000n // 1.5 Gwei
  const fallbackMax = 5_000_000_000n // 5 Gwei

  const maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas ?? fallbackPriority) + 1_000_000_000n
  const maxFeePerGas = (feeData.maxFeePerGas ?? fallbackMax) + 2_000_000_000n

  const tx = {
    to,
    value,
    gasLimit,
    maxPriorityFeePerGas,
    maxFeePerGas,
    nonce,
    type: 2
  }

  const response = await wallet.sendTransaction(tx)
  const type = fake ? 'FAKE' : 'REAL'
  console.log(`TX (${type}) sent: ${response.hash}`)

  const receipt = await response.wait()
  console.log(`TX confirmed in block: ${receipt.blockNumber}`)
  return response
}
