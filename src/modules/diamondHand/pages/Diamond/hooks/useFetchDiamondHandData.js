import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { config } from '../../../../../configs/config';
import { getTokenBalance } from '../../../../../api/token.service';
import { DiamondHandService } from '../../../../../api/diamondHand.service'; 

export const useFetchDiamondHandData = () => {
  const [rewardsInfo, setRewardsInfo] = useState({});
  const walletAddress = useSelector((store) => store.wallet.address);

  const fetchPAYBBAlance = async () => {
    try {
      const response = await getTokenBalance(config.YFIAG_ADDRESS);
      setRewardsInfo((prevState) => ({ ...prevState, paybBalance: response.toString() }));
    } catch (e) {
      console.error(e);
      setRewardsInfo((prevState) => ({ ...prevState, paybBalance: 0 }));
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
  
  const fetchEarnedPAYBTotal = async (id) => {
    try {
      const response = await DiamondHandService.toClaimV2(id);
      setRewardsInfo((prevState) => ({ ...prevState, paybEarned: response }));
    } catch (e) {
      console.error(e);
      setRewardsInfo((prevState) => ({ ...prevState, paybEarned: 0 }));
    }
  };

  const fetchDiamondHandData = () => {
    fetchRewardInfo();
    fetchEarnedPAYBTotal();
    fetchPAYBBAlance();
  };

  useEffect(() => {
    let intervalId = null;
    if (walletAddress) {
      fetchDiamondHandData();
      intervalId = setInterval(fetchEarnedPAYBTotal, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [walletAddress]);

  return { rewardsInfo, fetchDiamondHandData, fetchPAYBBAlance };
};
