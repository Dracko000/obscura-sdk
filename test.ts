import { sendGhostedTx } from './src'

sendGhostedTx({
  rpcUrl: 'https://scroll-sepolia.chainstacklabs.com',
  privateKey: 'bf89d33534cfe3b3bb8beef94634c9afea323abf53b90a54d5c3b7d5591c2a1e',
  to: '0x85F292DB19f7ADC5e7e39e4a4A87C38aB529B4aE',
  valueEth: '0.0001',
  fakeCount: 3,      // jumlah dummy tx setelah real
  delayMs: 750       // delay antar tx (ms)
}).catch(console.error)
