import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { config } from "../../../../../configs/config";
import { getTokenBalance } from "../../../../../api/token.service";
import { DiamondHandService } from "../../../../../api/diamondHand.service";

export const useFetchDiamondHandData = () => {
  const [rewardsInfo, setRewardsInfo] = useState({});
  const walletAddress = useSelector((store) => store.wallet.address);

  const fetchBalance = async () => {
    try {
      const response = await getTokenBalance(config.YFIAG_ADDRESS);
      setRewardsInfo((prevState) => ({
        ...prevState,
        tokenBalance: response.toString(),
      }));
    } catch (e) {
      console.error(e);
      setRewardsInfo((prevState) => ({ ...prevState, tokenBalance: 0 }));
    }
  };

  const fetchRewardInfo = async () => {
    try {
      const response = await DiamondHandService.getUserInfoFromFarmV2();
      setRewardsInfo((prevState) => ({ ...prevState, ...response }));
    } catch (e) {
      console.error(e);
      setRewardsInfo((prevState) => ({
        ...prevState,
        lockedAmount: 0,
        unlockedReward: 0,
      }));
    }
  };

  const fetchEarnedTokenTotal = async (id) => {
    try {
      const response = await DiamondHandService.toClaimV2(id);
      setRewardsInfo((prevState) => ({ ...prevState, tokenEarned: response }));
    } catch (e) {
      console.error(e);
      setRewardsInfo((prevState) => ({ ...prevState, tokenEarned: 0 }));
    }
  };

  const fetchDiamondHandData = () => {
    fetchRewardInfo();
    fetchEarnedTokenTotal();
    fetchBalance();
  };

  useEffect(() => {
    let intervalId = null;
    if (walletAddress) {
      fetchDiamondHandData();
      intervalId = setInterval(fetchEarnedTokenTotal, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return { rewardsInfo, fetchDiamondHandData, fetchBalance };
};
