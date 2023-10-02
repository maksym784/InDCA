"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FC, ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { MagicAuthConnector } from "@everipedia/wagmi-magic-connector";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_API_KEY_ALCHEMY || "",
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Securd",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "059415c7c59640771e4272d1c7383e7f",
      },
    }),
    new MagicAuthConnector({
      options: {
        apiKey: "pk_live_A92E80BE7F60C880",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <TooltipProvider>{children}</TooltipProvider>
    </WagmiConfig>
  );
};

export default Providers;
