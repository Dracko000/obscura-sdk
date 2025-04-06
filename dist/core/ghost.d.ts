import { GhostedTxOptions, GhostedTxResult } from '../types';
export declare function sendGhostedTx({ chain, rpcUrl, privateKey, to, valueEth, fakeCount, delayMs, mode, }: GhostedTxOptions): Promise<GhostedTxResult>;
