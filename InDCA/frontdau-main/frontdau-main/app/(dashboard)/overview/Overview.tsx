"use client";
import { useGetParams } from "@/lib/hook/useGetParams";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWithDrawStablecoin } from "@/lib/hook/useWithDrawStablecoin";
import BigNumber from "bignumber.js";
import { useGlobalParams } from "@/lib/hook/useGlobalParams";

function getFormattedDate(timestamp: number): string {
  const date = new Date(timestamp); // Convert to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

const Overview = () => {
  const { params } = useGetParams();
  const { paramsGlobal } = useGlobalParams();
  console.log(paramsGlobal);
  const [amountWithdraw, setAmountWithdraw] = useState<number>(0);

  const amountBigInt = useMemo(() => {
    const value = new BigNumber(amountWithdraw);
    const valueBigInt = value.times(new BigNumber(10).pow(18));
    return valueBigInt;
  }, [amountWithdraw]);

  const { WithDrawSuccess, writeWithdraw } = useWithDrawStablecoin(
    amountBigInt.toNumber()
  );

  return (
    <div className="center h-[calc(100vh-52px)]">
      <div className="w-[60%] m-auto flex flex-row space-x-10 ">
        <Card>
          <CardHeader>
            <CardTitle>Your Position Overview</CardTitle>
            <CardDescription>
              Manage and track your position In DCA.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
              <span className="text-xl text-gray-500 font-semibold">
                Last Deposit :
              </span>
              <div className="text-black">
                {getFormattedDate(params.usersParams.depositTimestamp * 1000)}
              </div>
            </div>

            <Separator />
            <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
              <span className="text-xl text-gray-500 font-semibold">
                Initial Deposit :
              </span>
              <div className="text-black">
                {params.usersParams.depositedAmount}
              </div>
            </div>

            <Separator />

            <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
              <span className="text-xl text-gray-500 font-semibold">
                Current Eth Bought :
              </span>
              <div className="text-black">{params.usersParams.ethBalance}</div>
            </div>

            <Separator />
            <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
              <span className="text-xl text-gray-500 font-semibold">
                Left USDC to invest:
              </span>
              <div className="text-black">
                {params.usersParams.stablecoinBalance}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-start items-start space-y-2">
            <Label>Amount USDC to Withdraw</Label>
            <div>
              <div className="flex flex-row space-x-2">
                <Input
                  type="Amount"
                  placeholder="Amount"
                  value={amountWithdraw}
                  onChange={(e) => {
                    setAmountWithdraw(Number(e.target.value));
                  }}
                />

                <Button
                  type="button"
                  onClick={() => {
                    setAmountWithdraw(params.usersParams.stablecoinBalance);
                  }}
                >
                  Max
                </Button>
              </div>
            </div>
            <Button
              variant={"uni"}
              onClick={() => {
                writeWithdraw?.();
              }}
            >
              Withdraw
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Health & Metrics</CardTitle>
            <CardDescription>
              <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                <span className="text-xl text-gray-500 font-semibold">
                  Amount of users:
                </span>
                <div className="text-black">{paramsGlobal.amountUsers}</div>
              </div>
              <Separator />
              <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                <span className="text-xl text-gray-500 font-semibold">
                  Rate Fees:
                </span>
                <div className="text-black">{paramsGlobal.rateFees}%</div>
              </div>
              <Separator />
              <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                <span className="text-xl text-gray-500 font-semibold">
                  Volume Swap:
                </span>
                <div className="text-black">{paramsGlobal.volumeSwaps}</div>
              </div>
              <Separator />
              <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                <span className="text-xl text-gray-500 font-semibold">
                  Total USDC Deposited:
                </span>
                <div className="text-black">{paramsGlobal.totalDeposited}</div>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
