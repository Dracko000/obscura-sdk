import { ethers } from 'ethers'

export function generateMirageAddress(seed: string): string {
  const wallet = ethers.Wallet.createRandom()
  return wallet.address
}
