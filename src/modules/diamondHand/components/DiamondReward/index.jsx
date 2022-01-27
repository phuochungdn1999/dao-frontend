import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cx from "classnames";
import style from "./DiamondReward.module.scss";
import { ReactComponent as LockIcon } from "../../assets/icons/lock.svg";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import { ReactComponent as DiamondIcon } from "../../assets/icons/diamond.svg";
import { getSixDigitsAfterComma } from "../../../../utils/getSixDigitsAfterComma";
import { getUserInfoFromFarmV2 } from "../../../../api/diamondHand.service";
import { getTotalSupplyDiamondHand } from "../../../../api/token.service";

import moment from "moment";
const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    pools: state.pools,
  };
};

const DiamondReward = ({ t, walletBalance, poolData, theme }) => {
  const [rewardsInfo, setRewardsInfo] = useState();

  const [totalLifetimeStaked, setTotaLifetimeStaked] = useState(0);
  const [totalLifetimeEarned, setTotaLifetimeEarned] = useState(0);

  const [totalCurrentStaked, setTotalCurrentStaked] = useState(0);
  const [totalCurrentEarned, setTotaCurrentEarned] = useState(0);

  const [totalSupply, setTotalSupply] = useState(0);

  const fetchRewardInfo = async () => {
    try {
      const response = await getUserInfoFromFarmV2();
      setRewardsInfo(response);
    } catch (e) {
      console.error(e);
      setRewardsInfo({
        ...rewardsInfo,
        lockedAmount: 0,
        unlockedReward: 0,
      });
    }
  };

  useEffect(() => {
    const fetchTotalSupply = async () => {
      try {
        const response = await getTotalSupplyDiamondHand(window.ethereum);
        setTotalSupply(response);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRewardInfo();

    fetchTotalSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (poolData?.users.length > 0) {
      const userPools = poolData.users[0].userPools;
      const today = moment();

      let lifetimeStaked = 0;
      let lifetimeEarned = 0;
      let currentStake = 0;
      let currentEarned = 0;

      for (let pool of userPools) {
        const dueDate = moment.unix(pool.depositedAt).add(pool.duration, "s");

        lifetimeStaked += pool.amount / 10 ** 18; //total stake in lifetime

        if (today.isAfter(dueDate)) {
          //total earned (unlocked + claimed) in lifetime
          lifetimeEarned += pool.rewardDebt / 10 ** 30;
        }

        if (!pool.claimed) {
          currentStake += pool.amount / 10 ** 18; //total unclaimed stake

          if (today.isAfter(dueDate)) {
            currentEarned += pool.rewardDebt / 10 ** 30; //total unlocked but unclaimed
          }
        }
      }

      setTotaLifetimeStaked(lifetimeStaked);
      setTotaLifetimeEarned(lifetimeEarned);
      setTotalCurrentStaked(currentStake);
      setTotaCurrentEarned(currentEarned);
    }
  }, [poolData]);

  return (
    <>
      <div className={cx(style.diamond__reward__container)}>
        <div
          className={cx(
            style.diamond__reward__title.length,
            theme?.isDarkmode && style.diamond__reward__dark_text
          )}
        >
          {t("DIAMOND_REWARD_SUMMARY")}
        </div>

        <div className={cx(style.diamond__reward__earnedCard)}>
          <div className={cx(style.diamond__reward__coinStaked)}>
            <p
              className={cx(
                style.diamond__reward__coinStaked_title.length,
                theme?.isDarkmode && style.diamond__reward__dark_text
              )}
            >
               {t("DIAMOND_YFIAG_STAKED")} YFIAG
            </p>
            <p
              className={cx(style.diamond__reward__coinStaked_number)}
              style={{ fontWeight: 700 }}
            >
              {totalLifetimeStaked}
            </p>
          </div>
          <div className={cx(style.diamond__reward__coinEarned)}>
            <p
              className={cx(
                style.diamond__reward__coinStaked_title.length,
                theme?.isDarkmode && style.diamond__reward__dark_text
              )}
            >
              {t("DIAMOND_YFIAG_EARNED")} YFIAG
            </p>
            <p className={cx(style.diamond__reward__coinStaked_number)}>
              {getSixDigitsAfterComma(totalLifetimeEarned, 4)}
            </p>
          </div>
        </div>

        <div className={cx(style.diamond__reward__detailCard)}>
          <div className={cx(style.diamond__reward__detail)}>
            <p
              style={{ display: "flex", marginBottom: 0, alignItems: "center" }}
            >
              <WalletIcon />
              <span
                className={cx(
                  style.diamond__reward__coinStaked_title.length,
                  theme?.isDarkmode && style.diamond__reward__dark_text,
                  style.invertedColor
                )}
              >
                {t("DIAMOND_WALLET_BALANCE")}
              </span>
            </p>
            <p
              className={cx(
                style.diamond__reward__coinStaked_number,
                style.invertedColor
              )}
            >
              {getSixDigitsAfterComma(walletBalance)}
            </p>
          </div>
          <div className={cx(style.diamond__reward__detail_secondLine)}>
            <div className={cx(style.diamond__reward__detail)}>
              <p
                style={{
                  display: "flex",
                  marginBottom: 0,
                  alignItems: "center",
                }}
              >
                <LockIcon />
                <span
                  className={cx(
                    style.diamond__reward__coinStaked_title.length,
                    theme?.isDarkmode && style.diamond__reward__dark_text,
                    style.invertedColor
                  )}
                >
                  {t("DIAMOND_LOCKED_AMOUNT")}
                </span>
              </p>
              <p
                className={cx(
                  style.diamond__reward__coinStaked_number,
                  style.invertedColor
                )}
              >
                {getSixDigitsAfterComma(totalCurrentStaked, 4)}
              </p>
            </div>
            <div className={cx(style.diamond__reward__detail)}>
              <p
                style={{
                  display: "flex",
                  marginBottom: 0,
                  alignItems: "center",
                }}
              >
                {" "}
                <DiamondIcon />
                <span
                  className={cx(
                    style.diamond__reward__coinStaked_title.length,
                    theme?.isDarkmode && style.diamond__reward__dark_text,
                    style.invertedColor
                  )}
                >
                  {t("DIAMOND_UNLOCKED_REWARD")}
                </span>
              </p>
              <p
                className={cx(
                  style.diamond__reward__coinStaked_number,
                  style.invertedColor
                )}
              >
                {getSixDigitsAfterComma(totalCurrentEarned, 4)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(style.diamond__reward__global__container)}>
        <div className={cx(style.diamond__reward__global_text)}>
          <span
            className={cx(
              style.diamond__reward__coinStaked_title.length,
              theme?.isDarkmode && style.diamond__reward__dark_text,
              style.invertedColor
            )}
            style={{ fontSize: "1rem" }}
          >
            {t("DIAMOND_GLOBAL_STAKE")}
          </span>
        </div>
        <div className={cx(style.diamond__reward__global_text)}>
          <span
            className={cx(style.diamond__reward__coinStaked_number)}
            style={{ color: "#8736cb", fontSize: "1.125rem" }}
          >
            {getSixDigitsAfterComma(totalSupply)}
          </span>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(connect(mapState)(DiamondReward));
