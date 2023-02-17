import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ENS from "ethjs-ens";
import { Layout, Modal, Row } from "antd";
import cx from "classnames";
import { actionTypes } from "../../reducers/layout";
import moon from "./moon.svg";
import sun from "./sun.svg";

import { Connections } from "../../../connections";

import { pages } from "../../../";

// helpers:
import { makeShortAddress } from "../../../common";

import style from "./Header.module.scss";

const { Header: HeaderLayout } = Layout;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    connection: state.connection,
    account: state.account,
    chains: state.chains,
    theme: state.theme,
  };
};

const Header = ({
  web3context,
  connection,
  location,
  account,
  chains,
  t,
  darkMode,
  setDarkMode,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addressEnsName, setAddressEnsName] = useState(null);
  const [currentChain, setCurrentChain] = useState("");
  const [address, setAddress] = useState(null);

  const dispatch = useDispatch();

  const parseAddressName = async (address, provider) => {
    const cuttedAddress = makeShortAddress(address);

    setAddress(cuttedAddress);

    const chainId = parseInt(provider?.chainId, 16);
    const network = chainId || provider?.networkVersion;

    const ens = new ENS({ provider, network });
    const addressEnsName = await ens.reverse(address).catch((error) => {
      console.warn(`Parsed name by ENS: ${error?.message}`);
    });

    addressEnsName && setAddressEnsName(addressEnsName);
  };

  const findCurrentChain = (chainId, chainList) => {
    const chain = chainList.find((item) => item?.chainId === chainId);

    setCurrentChain(chain?.name || "Unknown");
  };

  useEffect(() => {
    if (web3context?.provider && connection?.status && account?.address) {
      parseAddressName(account.address, web3context.provider);
      setIsModalVisible(false);
    } else {
      setAddress(null);
      setAddressEnsName(null);
      setIsModalVisible(false);
    }
  }, [web3context, connection, account]);

  useEffect(() => {
    web3context?.chain &&
      chains?.list &&
      findCurrentChain(web3context.chain, chains.list);
  }, [web3context, chains]);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <HeaderLayout className={style.container}>
      <Row className={style.container__row} align="middle">
        <NavLink className={style.container__row__title} exact to="/">
          {/* <img
            className="logo"
            src="/assets/images/logo-yearn-agnostic.svg"
            alt={t("LAYOUT_HEADER_LOGO")}
          /> */}
        </NavLink>

        <button className="switcher">
          <div>
            <img
              className="switch"
              src={sun}
              onClick={() => {
                setDarkMode(false);
                dispatch({ type: actionTypes.CHANGE_THEME_MODE, payload: false });
              }}
              alt="sun"
            />
            /
            <img
              className="img"
              src={moon}
              onClick={() => {
                setDarkMode(true);
                dispatch({ type: actionTypes.CHANGE_THEME_MODE, payload: true });
              }}
              alt="moon"
            />
            <div></div>
          </div>
        </button>

        <Row className={style.container__row__menu} align="middle">
          {pages.map(
            ({ path, title, visible }) =>
              visible && (
                <NavLink
                  className={cx(style.container__row__menu__item, {
                    [style.container__row__menu__item_active]:
                      location.pathname === path,
                  })}
                  exact
                  key={path}
                  to={path}
                >
                  {t(title)}
                </NavLink>
              )
          )}
        </Row>

        {address && currentChain && (
          <div className={style.container__row__chain}>
            <span className={style.container__row__chain__title}>
              Currently used chain:
            </span>
            <strong className={style.container__row__chain__value}>
              {currentChain}
            </strong>
          </div>
        )}

        {address ? (
          <button
            className={cx(
              style.container__row__wallet,
              style.container__row__wallet_connected
            )}
            onClick={() => setIsModalVisible(true)}
          >
            <span>{addressEnsName || address}</span>
          </button>
        ) : (
          <button
            className={style.container__row__wallet}
            onClick={() => setIsModalVisible(true)}
          >
            <span>{t("LAYOUT_HEADER_CONNECT_WALLET")}</span>
          </button>
        )}
      </Row>

      <Modal
        destroyOnClose
        className={style.container__modal}
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
        footer={null}
        title={"Select a wallet :"}
      >
        <Connections />
        <p>
          Wallets are used to send, receive, and store digital assets like
          Ether. Currently is dApp supporting only Metamask wallet.
        </p>
      </Modal>
    </HeaderLayout>
  );
};

Header.propTypes = {
  web3context: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(withRouter(connect(mapState)(Header)));
