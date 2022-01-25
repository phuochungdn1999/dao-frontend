import { useState } from "react";
import { DiamondHandService } from "../../../../../api/diamondHand.service";
import { ethers } from "ethers";

export const useUnstakeDiamondHand = (
  onUnstackingSuccess,
  onUnstackingEnd,
  poolId
) => {
  const [isUnstakingInProgress, setIsUnstakingInProgress] = useState(false);

  const handleUnstakeSubmit = async (provider) => {
    let etherProvider = new ethers.providers.Web3Provider(provider);
    setIsUnstakingInProgress(true);
    try {
      const { wait } = await DiamondHandService.unstakeV2(
        etherProvider,
        poolId
      );
      await wait();

      setIsUnstakingInProgress(false);
      onUnstackingEnd();
      onUnstackingSuccess();
    } catch (e) {
      console.error(e);
   
      setIsUnstakingInProgress(false);
      onUnstackingEnd(true);
    }
  };

  return {
    handleUnstakeSubmit,
    isUnstakingInProgress,
  };
};
