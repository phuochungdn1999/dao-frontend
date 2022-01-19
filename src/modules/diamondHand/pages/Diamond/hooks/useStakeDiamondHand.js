import { useState } from "react";
import { dev } from "../../../../../configs/config";
import { DiamondHandService } from "../../../../../api/diamondHand.service";
import { useStakeFormsHandler } from "./useStakeFormsHandler";
import { ethers } from "ethers";

export const useStakeDiamondHand = (
  //  onStakingSuccess,
  onStakingEnd,
  poolSetting,
  accountAddress
) => {
  const [isStakingInProgress, setIsStakingInProgress] = useState(false);

  const { inputValue, handleInput } = useStakeFormsHandler();

  const handleStakeSubmit = async (provider) => {
    let provider2 = new ethers.providers.Web3Provider(provider);
    setIsStakingInProgress(true);
    try {
      const { hash, wait } = await DiamondHandService.stakeV2(
        poolSetting,
        inputValue,
        accountAddress,
        provider2
      );
      await wait();

      setIsStakingInProgress(false);
      onStakingEnd(true);
      handleInput("");
    } catch (e) {
      console.error(e);
      setIsStakingInProgress(false);
      onStakingEnd(false);
      handleInput("");
    }
  };

  return {
    inputValue,
    handleInput,
    handleStakeSubmit,
    isStakingInProgress,
  };
};
