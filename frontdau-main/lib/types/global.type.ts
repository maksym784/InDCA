export type Path = {
  deposit: boolean;
  overview: boolean;
  informations: boolean;
};

export const blockchainEnum = {
  mainnet: "mainnet",
  bnbchain: "bnbchain",
  arbitrum: "arbitrum",
} as const;

export type Blockchain = (typeof blockchainEnum)[keyof typeof blockchainEnum];

export type Token = {
  symbol: string;
  id: string;
  svgLogo: string;
};
export type TokenSell = {
  symbol: "USDC" | "DAI";
  id: string;
  svgLogo: string;
};

export type Position = {
  sell: "USDC" | "DAI";
  buy: "ETH";
  amount: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | undefined;
  indicator: "FEAR & GREAD" | "CBBI" | "RSI" | undefined;
};

export type Incide = 1 | 2 | 3;
