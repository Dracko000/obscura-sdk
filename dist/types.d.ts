export interface ChainConfig {
    name: string;
    rpcUrl: string;
    chainId: number;
}
export type Chains = {
    [key in 'scrollSepolia' | 'baseSepolia' | 'polygonAmoy']: ChainConfig;
};
export type ChainName = keyof Chains;
export interface ObscureIntent {
    to: string;
    data: string;
    fake?: boolean;
    metadata?: Record<string, any>;
}
export interface SendObscureTxOptions {
    rpcUrl: string;
    privateKey: string;
    to: string;
    valueEth: string;
    fake: boolean;
    nonce: number;
}
export interface SentTxResult {
    hash: string;
    blockNumber: number | null;
}
export interface GhostedTxOptions {
    chain?: ChainName;
    rpcUrl?: string;
    privateKey: string;
    to: string;
    valueEth: string;
    fakeCount?: number;
    delayMs?: number;
    mode?: 'serial' | 'parallel';
}
export interface GhostedTxResult {
    real: SentTxResult;
    fakes: SentTxResult[];
}
