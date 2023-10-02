"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Blockchain,
  Position,
  Token,
  TokenSell,
} from "@/lib/types/global.type";
import { MoveRight } from "lucide-react";
import USDClogo from "../../../assets/logos/tokens/USDC.svg";
import DaiLogo from "../../../assets/logos/tokens/DAILogo.svg";
import ETHLogo from "../../../assets/logos/tokens/ETHlogo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Resume from "@/components/Resume/Resume";
import { useGetParams } from "@/lib/hook/useGetParams";

const sellTokens: TokenSell[] = [
  {
    id: "1",
    symbol: "USDC",
    svgLogo: USDClogo,
  },
  {
    id: "2",
    symbol: "DAI",
    svgLogo: DaiLogo,
  },
];

const receiveTokens: Token[] = [
  {
    id: "3",
    symbol: "ETH",
    svgLogo: ETHLogo,
  },
];

const Deposit = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<Blockchain>();
  const [addressSRG20, setAddressSRG20] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    sell: "USDC",
    amount: 0,
    buy: "ETH",
    frequency: undefined,
    indicator: undefined,
  });
  const { params } = useGetParams();

  return (
    <div className="center h-[calc(100vh-52px)]">
      <div className="w-[30%] m-auto ">
        <Card>
          <CardHeader>
            <CardTitle>DCA</CardTitle>
            <CardDescription>
              A steady strategy in crypto&#8217;s dynamic world. Grow smarter,
              deposit now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-10">
              <Card>
                <CardHeader>Deposit</CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="DexVersion">Blockchain</Label>
                        <Select
                          onValueChange={(e: Blockchain) => {
                            setSelectedBlockchain(e);
                          }}
                        >
                          <SelectTrigger id="DexVersion">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="mainnet">Mainnet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="flex flex-row items-center justify-between ">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="DexVersion">Sell</Label>
                          <Select
                            onValueChange={(e: Blockchain) => {
                              setAddressSRG20(e);
                            }}
                          >
                            <SelectTrigger id="DexVersion" className="w-40">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {sellTokens.map((token, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={token.id}
                                    onClick={() => {
                                      setPosition({
                                        ...position,
                                        sell: token.symbol,
                                      });
                                    }}
                                  >
                                    <div className="flex flex-row space-x-2">
                                      <Image
                                        src={token.svgLogo}
                                        alt="metamakLogo"
                                      />
                                      <div>{token.symbol}</div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <MoveRight />

                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="DexVersion">Receive</Label>
                          <Select
                            onValueChange={(e: Blockchain) => {
                              setAddressSRG20(e);
                            }}
                          >
                            <SelectTrigger id="DexVersion" className="w-40">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {receiveTokens.map((token, index) => {
                                return (
                                  <SelectItem key={index} value={token.id}>
                                    <div className="flex flex-row space-x-2">
                                      <Image
                                        src={token.svgLogo}
                                        alt="metamakLogo"
                                      />
                                      <div>{token.symbol}</div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex w-full max-w-sm items-end space-x-2">
                        <div className=" space-y-2">
                          <Label>Amount to deposit</Label>
                          <div className="flex flex-row space-x-2">
                            <Input
                              type="Amount"
                              placeholder="Amount"
                              value={position.amount}
                              onChange={(e) => {
                                setPosition({
                                  ...position,
                                  amount: Number(e.target.value),
                                });
                              }}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                setPosition({
                                  ...position,
                                  amount: params.balanceWallet,
                                });
                              }}
                            >
                              Max
                            </Button>
                          </div>
                          <div className="text-xs font-medium text-gray-400">
                            Balance : {params.balanceWallet} {position.sell}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Frequence DCA</Label>
                        <div className=" space-x-2">
                          <Button
                            className={`${
                              position.frequency === "DAILY" && "opacity-60"
                            }`}
                            variant={"secondary"}
                            onClick={() => {
                              setPosition({ ...position, frequency: "DAILY" });
                            }}
                          >
                            Daily
                          </Button>
                          <Button
                            className={`${
                              position.frequency === "WEEKLY" && "opacity-30"
                            }`}
                            variant={"secondary"}
                            onClick={() => {
                              setPosition({ ...position, frequency: "WEEKLY" });
                            }}
                          >
                            Weekly
                          </Button>
                          <Button
                            className={`${
                              position.frequency === "MONTHLY" && "opacity-30"
                            }`}
                            variant={"secondary"}
                            onClick={() => {
                              setPosition({
                                ...position,
                                frequency: "MONTHLY",
                              });
                            }}
                          >
                            Monthly
                          </Button>
                        </div>
                      </div>

                      <Separator />
                      <div className="space-y-2">
                        <Label>Indicator</Label>
                        <div className=" space-x-2">
                          <Button
                            className={`${
                              position.indicator === "FEAR & GREAD" &&
                              "opacity-30"
                            }`}
                            variant={"default"}
                            onClick={() => {
                              setPosition({
                                ...position,
                                indicator: "FEAR & GREAD",
                              });
                            }}
                          >
                            Fear & Greed
                          </Button>
                          <Button
                            className={`${
                              position.indicator === "CBBI" && "opacity-30"
                            }`}
                            variant={"default"}
                            onClick={() => {
                              setPosition({
                                ...position,
                                indicator: "CBBI",
                              });
                            }}
                          >
                            CBBI
                          </Button>
                          <Button
                            className={`${
                              position.indicator === "RSI" && "opacity-30"
                            }`}
                            variant={"default"}
                            onClick={() => {
                              setPosition({
                                ...position,
                                indicator: "RSI",
                              });
                            }}
                          >
                            RSI
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    disabled={
                      position.frequency === undefined ||
                      position.indicator === undefined
                    }
                    variant={"uni"}
                    onClick={() => {
                      setOpen((prev) => !prev);
                    }}
                  >
                    Confirm
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      <Resume open={open} setOpen={setOpen} position={position} />
    </div>
  );
};

export default Deposit;
