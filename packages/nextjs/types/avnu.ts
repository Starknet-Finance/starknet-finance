interface TokenData {
  address: string;
  decimal: number;
  logoUri: string;
  name: string;
  symbol: string;
  chainId: string;
}

interface TokenListResponse {
  content: TokenData[];
  numberOfElements: number;
}

interface SwapQuote {
  avnuFees: string;
  avnuFeesBps: string;
  avnuFeesInUsd: number;
  blockNumber: string;
  buyAmount: string;
  buyAmountInUsd: number;
  buyAmountWithoutFees: string;
  buyAmountWithoutFeesInUsd: number;
  buyTokenAddress: string;
  buyTokenPriceInUsd: number;
  chainId: string;
  estimatedAmount: boolean;
  exactTokenTo: boolean;
  expiry: null;
  gasFees: string;
  gasFeesInUsd: number;
  gasless: {
    active: boolean;
    gasTokenPrices: Array<any>;
  };
  integratorFees: string;
  integratorFeesBps: string;
  integratorFeesInUsd: number;
  liquiditySource: string;
  priceRatioUsd: number;
  quoteId: string;
  routes: Array<any>;
  sellAmount: string;
  sellAmountInUsd: number;
  sellTokenPriceInUsd: number;
  sellTokenAddress: string;
}

type SwapQuoteResponse = SwapQuote[];

interface SwapCall {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

interface BuildSwapResponse {
  chainId: string;
  calls: SwapCall[];
}

export type {
  TokenData,
  TokenListResponse,
  SwapQuote,
  SwapQuoteResponse,
  SwapCall,
  BuildSwapResponse,
};
