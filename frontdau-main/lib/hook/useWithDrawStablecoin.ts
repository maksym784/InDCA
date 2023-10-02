import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abiDCA, addressDCA } from "../constants/constants";

export const useWithDrawStablecoin = (amount: number) => {
  const { config: WithdrawConfig } = usePrepareContractWrite({
    address: addressDCA as `0x${string}`,
    abi: abiDCA,
    functionName: "withdrawStablecoin",
    args: [amount],
    onError(error) {
      console.log("Error Swap", error);
    },
  });

  const { data, write: writeWithdraw } = useContractWrite(WithdrawConfig);

  const {
    isSuccess: WithDrawSuccess,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { WithDrawSuccess, writeWithdraw };
};
