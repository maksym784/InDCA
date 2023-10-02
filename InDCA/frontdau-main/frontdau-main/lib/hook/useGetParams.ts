import { useAccount, useContractReads } from "wagmi";
import {
  abiDCA,
  abiERC20,
  addressDCA,
  addressUSDC,
} from "../constants/constants";
import { useState } from "react";
type UserParams = {
  depositedAmount: number;
  depositTimestamp: number;
  stablecoinBalance: number;
  ethBalance: number;
};

type ParamsObject = {
  balanceWallet: number;
  usersParams: UserParams;
};
export const useGetParams = () => {
  const { address, isConnected } = useAccount();
  const [params, setParams] = useState<ParamsObject>({
    balanceWallet: 0,
    usersParams: {
      depositedAmount: 0,
      depositTimestamp: 0,
      stablecoinBalance: 0,
      ethBalance: 0,
    },
  });

  useContractReads({
    contracts: [
      {
        address: addressUSDC as `0x${string}`,
        abi: abiERC20 as any,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: addressDCA as `0x${string}`,
        abi: abiDCA as any,
        functionName: "users",
        args: [address as `0x${string}`],
      },
    ],
    onSuccess(data: any) {
      setParams({
        balanceWallet: Number(data[0].result) / 10 ** 18,
        usersParams: {
          depositedAmount: Number(data[1].result[0]) / 10 ** 18,
          depositTimestamp: Number(data[1].result[1]),
          stablecoinBalance: Number(data[1].result[2]) / 10 ** 18,
          ethBalance: Number(data[1].result[3]),
        },
      });
    },
    enabled: isConnected,
    watch: true,
  });
  return { params };
};
