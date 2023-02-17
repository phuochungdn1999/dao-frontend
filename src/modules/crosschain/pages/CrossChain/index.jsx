import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Typography, Alert, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import cx from "classnames";

// configs:
import { crosschain as crosschainList } from "../../../../configs";

// components:
import { AvailableChains } from "../../../common";
import {
  CrossChainDescription,
  CrossChainFormHeader,
  CrossChainFormFields,
  CrossChainFormFields1,
} from "../../";

// helpers:
import { getAvailableChain } from "../../../common";

// thunks:
import { getGasPrices } from "../../../dashboard";
import { getCrossChainBalances } from "../../";

import style from "./CrossChain.module.scss";
import chain from "../../../../configs/crosschain-80001";
import CrossChainFormFields2 from "../../components/CrossChainFormFields3";
import CrossChainFormFields3 from "../../components/CrossChainFormFields4";
import CrossChainFormFields4 from "../../components/CrossChainFormFields5";


const { Title } = Typography;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    crosschain: state.crosschain,
    account: state.account,
    prices: state.prices,
    chains: state.chains,
  };
};

const CrossChain = ({
  web3context,
  crosschain,
  account,
  prices,
  chains,
  t,
}) => {
  const dispatch = useDispatch();

  const [availableChain, setAvailableChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetCrossChainBalances = useCallback(
    (payload) => dispatch(getCrossChainBalances(payload)),
    [dispatch]
  );

  const onGetGasPrices = useCallback(
    (payload) => dispatch(getGasPrices(payload)),
    [dispatch]
  );

  useEffect(() => {
    web3context?.chain &&
      setAvailableChain(getAvailableChain(web3context.chain, crosschainList));
  }, [web3context]);

  useEffect(() => {
    if (crosschain?.loading || account?.loading || prices?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [prices, account, crosschain]);

  useEffect(() => {
    web3context?.instance && onGetGasPrices({ web3: web3context.instance });
  }, [onGetGasPrices, web3context]);

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      availableChain &&
      onGetCrossChainBalances({
        web3: web3context.instance,
        asset: availableChain,
        account: account.address,
      });
  }, [onGetCrossChainBalances, account, web3context, availableChain]);

  return (
    <Typography
      className={cx(style.container, {
        [style.container_loading]: isLoading,
      })}
    >
      <Title className={style.title}>
        <span className={style.titlecs}>DAO</span>
      </Title>

      <Alert
        className={style.container__info}
        message={t("DASHBOARD_INFO")}
        type="info"
      />

      {account?.address ? (
        availableChain ? (
          <>
            <Row className={style.container__form} justify="space-between">
              <CrossChainFormFields3
                availableChain={availableChain}
                className={style.container__form__fields}
              />
            </Row>
            <Row className={style.container__form} justify="space-between">
              <CrossChainFormFields2
                availableChain={availableChain}
                className={style.container__form__fields}
              />
            </Row>

            <Row className={style.container__form} justify="space-between">
              <CrossChainFormFields4
                availableChain={availableChain}
                className={style.container__form__fields}
              />
            </Row>

            <Row className={style.container__form} justify="space-between">
              <CrossChainFormFields1
                availableChain={availableChain}
                className={style.container__form__fields}
              />
            </Row>

            {/* <CrossChainDescription /> */}

            {/* <AvailableChains configChains={crosschainList} /> */}
          </>
        ) : (
          <Alert
            className={style.container__warning}
            message={t("CROSS_CHAIN_WARNING")}
            type="warning"
          />
        )
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

CrossChain.propTypes = {
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(CrossChain));
