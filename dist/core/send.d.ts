import { SendObscureTxOptions, SentTxResult } from '../types';
export declare function sendObscureTx({ rpcUrl, privateKey, to, valueEth, fake, nonce, }: SendObscureTxOptions): Promise<SentTxResult>;
