import React, { useEffect, useState, useCallback } from "react";
import { Typography, Alert } from "antd";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import style from "./Diamond.module.scss";
import cx from "classnames";
import { getAvailableChain } from "../../../common";
import { pools as poolsList } from "../../../../configs";
import DiamondReward from "../../components/DiamondReward";
import DiamondAmount from "../../components/DiamondAmount";
import DiamondHistory from "../../components/DiamondHistory";
import { getUserBalance } from "../../thunk/getWalletBalance";
import { gql, useQuery } from "@apollo/client";
import { dev } from "../../../../configs/config";

const { Title } = Typography;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    pools: state.pools,
    theme: state.theme,
  };
};

const DiamondHand = ({ web3context, account, pools, t, theme }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [availableChain, setAvailableChain] = useState(null);

  const EXCHANGE_RATES = gql`
    query GetPoolHistory($address: String!) {
      users(where: { address: $address }) {
        id
        address
        userPools {
          id
          amount
          rewardDebt
          apy
          duration
          depositedAt
          claimed
        }
      }
    }
  `;

  const { data: poolData, refetch } = useQuery(EXCHANGE_RATES, {
    variables: {
      address: account.address,
    },
    pollInterval: 60000,
  });

  const getbalance = useCallback(
    async (chain) => {
      let balanceValue = await getUserBalance(
        web3context.instance,
        chain[0].tokens[0],
        account.address
      );

      if (balanceValue !== null && balanceValue !== 0) {
        if (balanceValue !== null || balanceValue !== undefined) {
          setBalance(balanceValue / 10 ** 18);
        }
      }
    },
    [web3context.instance, account]
  );

  useEffect(() => {
    if (web3context?.chain && account.address && web3context.instance)
      setAvailableChain(getAvailableChain(web3context.chain, poolsList));
  }, [account.address, web3context]);

  useEffect(() => {
    const balanceOnChain = async () => {
      if (availableChain !== null) {
        await getbalance(availableChain);
      }
    };
    balanceOnChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableChain]);

  useEffect(() => {
    if (pools?.loading || account?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [account, pools]);

  return (
    <>
      <Typography
        className={cx(style.container, {
          [style.container_loading]: isLoading,
        })}
      >
        <Title className={style.title}>
          <div>
            <span>{t("DIAMOND_HAND_HEADER_TITLE")}</span>
            <Alert
              className={style.container__info}
              message={t("DASHBOARD_INFO")}
              type="info"
            />
          </div>
          <div
            className={style.viewScan}
            onClick={() => {
              window.open(
                dev()
                  ? `https://testnet.bscscan.com/address/${account.address}`
                  : `https://testnet.bscscan.com/address/${account.address}`,
                //TODO: `https://bscscan.com/address/${account.address}`,
                "_blank"
              );
            }}
          >
            View Transaction History on BSC Scan
          </div>
        </Title>

        {account?.address ? (
          <>
            <div className={style.diamond__content}>
              <div
                className={cx(
                  style.diamond__reward__mobile,
                  style.diamond__content__div,
                  theme.isDarkmode && style.diamond__reward__dark
                )}
              >
                <DiamondReward
                  theme={theme}
                  walletBalance={balance}
                  poolData={poolData}
                />
              </div>
              <div>
                <div className={cx(style.diamond__input)}>
                  <DiamondAmount
                    theme={theme}
                    walletBalance={balance}
                    refetch={refetch}
                  />
                </div>
                <div className={cx(style.diamond__input)}>
                  <DiamondHistory
                    theme={theme}
                    poolData={poolData}
                    refetch={refetch}
                  />
                </div>
              </div>

              <div
                className={cx(
                  style.diamond__reward,
                  style.diamond__content__div,
                  theme.isDarkmode && style.diamond__reward__dark
                )}
              >
                <DiamondReward
                  theme={theme}
                  walletBalance={balance}
                  poolData={poolData}
                />
              </div>
            </div>
          </>
        ) : (
          <Alert
            className={style.container__warning}
            message="Please, connect your wallet to continue."
            type="warning"
          />
        )}
      </Typography>
    </>
  );
};

export default withTranslation()(connect(mapState)(DiamondHand));
