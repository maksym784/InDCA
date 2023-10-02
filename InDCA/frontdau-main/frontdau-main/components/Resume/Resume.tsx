"use client";
import { BigNumber } from "bignumber.js";
import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { Position } from "@/lib/types/global.type";
import useApprove from "@/lib/hook/useApprove";
import { useExecute } from "@/lib/hook/useExecute";
import { useDeposit } from "@/lib/hook/useDeposit";

type ResumeProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: Position;
};
const Resume = ({ open, setOpen, position }: ResumeProps) => {
  const amountBigInt = useMemo(() => {
    const value = new BigNumber(position.amount);
    const valueBigInt = value.times(new BigNumber(10).pow(18));
    return valueBigInt;
  }, [position]);
  const { ApproveSuccess, writeApprove } = useApprove(amountBigInt.toNumber());

  const { DepositSuccess, writeDeposit } = useDeposit(amountBigInt.toNumber());
  const { SwapSuccess, writeSwap } = useExecute(3);

  useEffect(() => {
    if (ApproveSuccess) {
      writeDeposit?.();
    }
  }, [ApproveSuccess]);

  useEffect(() => {
    if (DepositSuccess) {
      setOpen(false);
    }
  }, [DepositSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Check the details</CardDescription>
            </CardHeader>
          </DialogTitle>
          <DialogDescription>
            <CardContent>
              <div className="space-y-4">
                <div className="text-xl font-semibold text-black">Ethereum</div>
                <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                  <span className="text-xl text-gray-500 font-semibold">
                    Sell :
                  </span>
                  <div className="text-black">{position.sell}</div>
                </div>

                <Separator />

                <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                  <span className="text-xl text-gray-500 font-semibold">
                    Buy :
                  </span>
                  <div className="text-black">{position.buy}</div>
                </div>

                <Separator />

                <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                  <span className="text-xl text-gray-500 font-semibold">
                    Amount :
                  </span>
                  <div className="text-black flex flex-row space-x-2">
                    <div>{position.amount}</div>
                    <div>{position.sell}</div>
                  </div>
                </div>
                <Separator />

                <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                  <span className="text-xl text-gray-500 font-semibold">
                    Frequence :
                  </span>
                  <div className="text-black">{position.frequency}</div>
                </div>
                <Separator />

                <div className="text-2xl font-bold space-x-2 flex items-center flex-row">
                  <span className="text-xl text-gray-500 font-semibold">
                    Indicator :
                  </span>
                  <div className="text-black">{position.indicator}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className=" justify-end">
              <Button
                variant={"uni"}
                onClick={() => {
                  writeApprove?.();
                }}
              >
                Deposit
              </Button>
            </CardFooter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Resume;
