import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abiDCA, addressDCA } from "../constants/constants";

export const useDeposit = (amount: number) => {
  const { config: configDeposit } = usePrepareContractWrite({
    address: addressDCA as `0x${string}`,
    abi: abiDCA,
    functionName: "deposit",
    args: [amount],
    enabled: amount !== 0,
    onError(error) {
      console.log("Error approve", error);
    },
  });

  const { data, write: writeDeposit } = useContractWrite(configDeposit);
  const {
    isSuccess: DepositSuccess,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { DepositSuccess, writeDeposit };
};
