import { useContractReads } from "wagmi";
import {
  abiDCA,
  abiERC20,
  addressDCA,
  addressUSDC,
} from "../constants/constants";
import { useState } from "react";
type ProtocolStats = {
  rateFees: number;
  totalDeposited: number;
  volumeSwaps: number;
  amountUsers: number;
  owner: string;
};

export const useGlobalParams = () => {
  const [paramsGlobal, setParamsGlobal] = useState<ProtocolStats>({
    rateFees: 0,
    totalDeposited: 0,
    volumeSwaps: 0,
    amountUsers: 0,
    owner: " ",
  });

  useContractReads({
    contracts: [
      {
        address: addressDCA as `0x${string}`,
        abi: abiDCA as any,
        functionName: "getRateFees",
        args: [],
      },
      {
        address: addressDCA as `0x${string}`,
        abi: abiDCA as any,
        functionName: "getTotalDeposited",
        args: [],
      },
      {
        address: addressDCA as `0x${string}`,
        abi: abiDCA as any,
        functionName: "getTotalSwap",
        args: [],
      },
    ],
    onSuccess(data: any) {
      setParamsGlobal({
        rateFees: Number(data[0].result / 100),
        totalDeposited: Number(data[1].result) / 10 ** 18,
        volumeSwaps: Number(data[2].result) / 10 ** 18,
        amountUsers: 2,
        owner: "0x01738387092e007ccb8b5a73fac2a9ba23cf91d3",
      });
      console.log(data);
      console.log(paramsGlobal);
    },
    onError(data: any) {
      console.log(data);
    },
    watch: true,
  });
  return { paramsGlobal };
};
