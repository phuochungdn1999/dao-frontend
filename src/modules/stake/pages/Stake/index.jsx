import React, { useState, useEffect, useCallback, Component } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Typography, Collapse, Alert, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import cx from "classnames";
import  * as diamondService from '../../../../api/diamondHand.service'
// configs:
import { pools as poolsList } from "../../../../configs";

// components:
import { AvailableChains } from "../../../common";
import { StakeContent, StakeHeader } from "../../";

// helpers:
import { getAvailableChain } from "../../../common";

// thunks:
import { getPoolsBalances } from "../../";

// React switch

import Switch from "react-switch";

import style from "./Stake.module.scss";
import { diamond } from "../../../diamondHand";


const { Title } = Typography;
const { Panel } = Collapse;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    pools: state.pools,
    state: state
  };
};

const Stake = ({ web3context, account, pools, state, t }) => {
  const dispatch = useDispatch();

  const [availableChain, setAvailableChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetPoolsBalances = useCallback(
    (payload) => dispatch(getPoolsBalances(payload)),
    [dispatch]
  );

  useEffect(() => {
    if (pools?.loading || account?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [account, pools]);

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      availableChain &&
      onGetPoolsBalances({
        web3: web3context.instance,
        list: availableChain,
        account: account.address,
      });
  }, [onGetPoolsBalances, account, web3context, availableChain]);

  useEffect(() => {
    web3context?.chain &&
      setAvailableChain(getAvailableChain(web3context.chain, poolsList));
  }, [web3context]);

  return (
    <Typography
      className={cx(style.container, {
        [style.container_loading]: isLoading,
      })}
    >
      <Title className={style.title}>
        <span>{t("STAKE_TITLE")}</span>
        <Alert
          className={style.container__info}
          message={t("DASHBOARD_INFO")}
          type="info"
        />
      </Title>

      {account?.address ? (
        <>
          {availableChain ? (
            <>
              <div className={style.list}>
                <Title
                  className={cx(style.title, style.title_second)}
                  level={2}
                >
                 
                </Title>

                {pools?.list?.length > 0 ? (
                  <Collapse className={style.list} accordion bordered={false}>
                    {pools.list?.map((pool) => (
                      <Panel
                        header={<StakeHeader id={pool.id} />}
                        key={pool.id}
                      >
                        {pool?.tokens?.length ? (
                          <StakeContent list={availableChain} id={pool.id} />
                        ) : (
                          <Empty
                            description="Here is no tokens"
                            className={style.container__empty}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        )}
                      </Panel>
                    ))}
                  </Collapse>
                ) : (
                  <Empty
                    description="No pools"
                    className={style.container__empty}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </>
          ) : (
            <Alert
              className={style.container__warning}
              message=""
              type="warning"
            />
          )}

          {/* <AvailableChains configChains={poolsList} /> */}
        </>
      ) : (
        <Alert
          className={style.container__warning}
          message="Please, connect your wallet to continue."
          type="warning"
        />
      )}

      {isLoading && (
        <div className={style.container__loading}>
          <LoadingOutlined className={style.container__loading__icon} />
        </div>
      )}
    </Typography>
  );
};

Stake.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  pools: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(Stake));
