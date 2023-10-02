"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mainnet, useAccount, useConnect } from "wagmi";
import MetaMaskLogo from "../../assets/logos/wallet/metamask.svg";
import CoinbaseLogo from "../../assets/logos/wallet/coinbase.svg";
import WalletConnectLogo from "../../assets/logos/wallet/walletconnect.svg";
import Magic from "../../assets/logos/wallet/magic.svg";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { copyToClipboard } from "@/lib/helpers/global.helper";
import { polygonMumbai } from "viem/chains";

const ButtonLogIn = () => {
  const [open, setOpen] = useState(false);
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: polygonMumbai.id,
    onSuccess() {
      setOpen(false);
    },
  });
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const addressFormatted = useMemo(() => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  }, [address]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isConnected ? (
        <DialogTrigger>
          <Button size={"sm"} variant={"uni"}>
            Log In
          </Button>
        </DialogTrigger>
      ) : (
        <Button
          size={"sm"}
          variant={"uni"}
          onClick={() =>
            copyToClipboard(address)
              .then(() => {
                toast({
                  variant: "success",
                  description: "Wallet address copied.",
                });
              })
              .catch(() => {
                toast({
                  variant: "destructive",
                  description: "Error while copying address.",
                });
              })
          }
        >
          {addressFormatted}
        </Button>
      )}
      <DialogContent className="bg-grayCard2">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Wallet</DialogTitle>
          <DialogDescription>
            <div className="mt-2 mb-2 flex flex-col gap-3 text-xl text-white">
              <div className="my-3 flex flex-col gap-3 text-xl text-white">
                {connectors.map((connector) => (
                  <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className=" flex h-[50px] items-center gap-2 rounded-lg bg-gray-200 text-black  pl-3 hover:cursor-pointer"
                  >
                    {connector.name === "MetaMask" ? (
                      <Image src={MetaMaskLogo} alt="metamakLogo" />
                    ) : connector.name === "Coinbase Wallet" ? (
                      <Image src={CoinbaseLogo} alt="metamakLogo" />
                    ) : connector.name === "WalletConnect" ? (
                      <Image src={WalletConnectLogo} alt="metamakLogo" />
                    ) : (
                      <Image src={Magic} alt="MagicLogo" />
                    )}
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </button>
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonLogIn;
