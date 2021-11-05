import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Button, Row, message } from "antd";
import cx from "classnames";

import { injected } from "../../../../connectors";

import { getWeb3Instacne } from "../../";

import style from "./Connections.module.scss";

const { error: errorMessage } = message;

const connectionsList = [
  {
    name: "MetaMask",
    icon: "metamask",
    type: injected,
  },
];

const mapState = (state) => {
  return {
    accountState: state.account,
    web3context: state.web3context,
    connection: state.connection,
  };
};

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);

  library.pollingInterval = 8000;

  return library;
};

const Buttons = ({ web3context, connection, accountState, t }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const {
    deactivate,
    connector,
    activate,
    account,
    library,
    chainId,
    active,
    error,
  } = useWeb3React();

  const handleConnect = (type) => {
    setIsLoading(true);
    activate(type);
  };

  const handleDeactivate = () => {
    deactivate();

    connector?.handleClose && connector.handleClose();

    dispatch({ type: "UPDATE_CHAIN", payload: null });
    dispatch({ type: "UPDATE_ADDRESS", payload: null });
    dispatch({ type: "UPDATE_PROVIDER", payload: null });
    dispatch({ type: "UPDATE_INSTANCE", payload: null });
    dispatch({ type: "UPDATE_CONNECTION", payload: false });
  };

  const onUpdateAddress = useCallback(
    (payload) => dispatch({ type: "UPDATE_ADDRESS", payload }),
    [dispatch]
  );

  const onUpdateChain = useCallback(
    (payload) => dispatch({ type: "UPDATE_CHAIN", payload }),
    [dispatch]
  );

  const onUpdateProvider = useCallback(
    (payload) => {
      dispatch({ type: "UPDATE_PROVIDER", payload });
      dispatch(getWeb3Instacne(payload));
    },
    [dispatch]
  );

  const onUpdateConnection = useCallback(
    (payload) => dispatch({ type: "UPDATE_CONNECTION", payload }),
    [dispatch]
  );

  const onGetErrorText = useCallback(() => t("CONNECTIONS_ERROR"), [t]);

  useEffect(() => chainId && onUpdateChain(chainId), [chainId, onUpdateChain]);

  useEffect(() => account && onUpdateAddress(account), [
    account,
    onUpdateAddress,
  ]);

  useEffect(() => library?.provider && onUpdateProvider(library?.provider), [
    library,
    onUpdateProvider,
  ]);

  useEffect(() => {
    active && onUpdateConnection(active);

    setIsLoading(false);
  }, [active, onUpdateConnection]);

  useEffect(() => {
    if (error?.message) {
      errorMessage(
        error.message === "No Ethereum provider was found on window.ethereum."
          ? onGetErrorText()
          : error.message
      );

      console.log("error", error?.message);
    }

    setIsLoading(false);
  }, [error, onGetErrorText]);

  useEffect(() => {
    if (web3context?.provider && connection?.status && accountState?.address) {
      setIsLoading(false);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [web3context, connection, accountState]);

  return (
    <Row className={style.list} justify="center" align="middle">
      {connectionsList.map(({ name, icon, type }) => (
        <Button
          className={cx(style.list__button, {
            [style.list__button_connected]: isActive,
          })}
          disabled={isActive || isLoading}
          loading={isLoading}
          onClick={() => handleConnect(type)}
          icon={<img src={`assets/icons/icon-${icon}.svg`} alt={name} />}
          key={name}
        >
          {name}
        </Button>
      ))}

      <Button
        className={style.list__button}
        disabled={!isActive || isLoading}
        onClick={handleDeactivate}
      >
        {t("CONNECTIONS_DISCONNECT")}
      </Button>
    </Row>
  );
};

Buttons.propTypes = {
  accountState: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const Connections = ({ web3context, connection, accountState, t }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Buttons
        accountState={accountState}
        web3context={web3context}
        connection={connection}
        t={t}
      />
    </Web3ReactProvider>
  );
};

Connections.propTypes = {
  accountState: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(Connections));
