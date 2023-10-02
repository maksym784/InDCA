import { useContext, useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abiERC20, addressDCA, addressUSDC } from "../constants/constants";

const useApprove = (amount: number) => {
  const [toastId, setToastId] = useState<any>(null);

  const { config: configApprove } = usePrepareContractWrite({
    address: addressUSDC as `0x${string}`,
    abi: abiERC20,
    functionName: "approve",
    args: [addressDCA, amount],
    enabled: amount !== 0,
    onError(error) {
      console.log("Error approve", error);
    },
  });

  const { data, write: writeApprove } = useContractWrite(configApprove);

  const {
    isSuccess: ApproveSuccess,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  //   useEffect(() => {
  //     if (isLoadingApprove) {
  //       let toastvalue = toast.loading("APPROVE...");
  //       setToastId(toastvalue);
  //     }
  //     if (isSuccessApprove) {

  //       toast.update(toastId, {
  //         render: "APPROVE SUCCESS",
  //         type: "success",
  //         isLoading: false,
  //         className: "rotateY animated",
  //         autoClose: 5000,
  //       });
  //     }
  //     if (isErrorApprove) {
  //       toast.update(toastId, {
  //         render: "APPROVE ERROR",
  //         type: "error",
  //         isLoading: false,
  //         className: "rotateY animated",
  //         autoClose: 5000,
  //       });
  //     }
  //   }, [isSuccessApprove, isLoadingApprove, isErrorApprove]);

  return { ApproveSuccess, writeApprove };
};
export default useApprove;
