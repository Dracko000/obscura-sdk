import { Command } from 'commander'
import { sendGhostedTx } from './src/core/ghost'

const program = new Command()

program
  .command('tx:ghost')
  .description('Send real + fake txs (ghosted)')
  .option('--rpc <url>', 'RPC URL')
  .option('--key <privateKey>', 'Private key')
  .option('--to <address>', 'Recipient address')
  .option('--value <eth>', 'ETH value to send (real tx)')
  .option('--fake <count>', 'Number of fake txs', '2')
  .option('--delay <ms>', 'Delay between fake txs (serial mode)', '500')
  .option('--mode <mode>', 'Send mode: serial or parallel', 'serial')
  .action(async (opts) => {
    const {
      rpc,
      key,
      to,
      value,
      fake,
      delay,
      mode,
    } = opts

    await sendGhostedTx({
      rpcUrl: rpc,
      privateKey: key,
      to,
      valueEth: value,
      fakeCount: parseInt(fake),
      delayMs: parseInt(delay),
      mode: mode === 'parallel' ? 'parallel' : 'serial',
    })
  })

program.parse(process.argv)
