import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Incide } from "../types/global.type";
import { abiDCA, addressDCA } from "../constants/constants";

export const useExecute = (indice: Incide) => {
  const { config: configSwap } = usePrepareContractWrite({
    address: addressDCA as `0x${string}`,
    abi: abiDCA,
    functionName: "Swap",
    args: [indice],
    onError(error) {
      console.log("Error Swap", error);
    },
  });

  const { data, write: writeSwap } = useContractWrite(configSwap);

  const {
    isSuccess: SwapSuccess,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { SwapSuccess, writeSwap };
};
