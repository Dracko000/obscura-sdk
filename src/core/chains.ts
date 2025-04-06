import type { Chains } from '../types'

export const CHAINS: Chains = {
  scrollSepolia: {
    name: 'Scroll Sepolia',
    rpcUrl: 'https://scroll-sepolia.infura.io/v3/8d35b5c2615049d685361e028b7661fe',
    chainId: 534351,
  },
  baseSepolia: {
    name: 'Base Sepolia',
    rpcUrl: 'https://base-sepolia.infura.io/v3/8d35b5c2615049d685361e028b7661fe',
    chainId: 84532,
  },
  polygonAmoy: {
    name: 'Polygon Amoy',
    rpcUrl: 'https://polygon-amoy.infura.io/v3/8d35b5c2615049d685361e028b7661fe',
    chainId: 80002,
  },
  sepolia: {
    name: 'eth sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/8d35b5c2615049d685361e028b7661fe',
    chainId: 11155111,
  },
}
