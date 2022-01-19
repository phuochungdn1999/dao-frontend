import { useState } from "react";
import { useDispatch } from "react-redux";
import { dev } from "../../../../../configs/config";
import { DiamondHandService } from "../../../../../api/diamondHand.service";
//import { alertActions } from '../../../store';
import { ethers } from "ethers";

export const useUnstakeDiamondHand = (
  onUnstackingSuccess,
  onUnstackingEnd,
  poolId
) => {
  const [isUnstakingInProgress, setIsUnstakingInProgress] = useState(false);

  const dispatch = useDispatch();

  const handleUnstakeSubmit = async (provider) => {
    let etherProvider = new ethers.providers.Web3Provider(provider);
    setIsUnstakingInProgress(true);
    try {
      /* const { hash, wait } = await DiamondHandService.unstakeV2(
        etherProvider,
        poolId
      );
      await wait(); */

      setIsUnstakingInProgress(false);
      onUnstackingEnd();
      onUnstackingSuccess();
    } catch (e) {
      console.error(e);
      /* dispatch(
        alertActions.warning({
          heading: 'Woops... we cannot procced your transaction.',
          message: `Unstaking PAYB has failed.`,
        }),
      ); */
      setIsUnstakingInProgress(false);
      onUnstackingEnd(true);
    }
  };

  return {
    handleUnstakeSubmit,
    isUnstakingInProgress,
  };
};
