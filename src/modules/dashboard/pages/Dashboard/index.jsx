import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Select, Alert, Card, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import cx from 'classnames';

// configs:
import { vaults as vaultsList } from '../../../../configs';

// components:
import { AvailableChains } from '../../../common';
import { VaultBasedOn } from '../../../vaults';
import { DashboardList } from '../../';

// actions:
import { calculateDashboard } from '../../';

// helpers:
import { getAvailableChain } from '../../../common';

// thunks:
import { getVaultBalances } from '../../../vaults';
import { getUSDPrices } from '../../';

import style from './Dashboard.module.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const currency = [
  {
    value: 0,
    name: 'USD'
  },
  {
    value: 1,
    name: 'ETH'
  }
];

const growth = [
  {
    divider: 365,
    value: 0,
    name: 'DASHBOARD_GROWTH_DAILY'
  },
  {
    divider: 52,
    value: 1,
    name: 'DASHBOARD_GROWTH_WEEKLY'
  },
  {
    divider: 1,
    value: 2,
    name: 'DASHBOARD_GROWTH_YEARLY'
  }
];

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    vaults: state.vaults,
    prices: state.prices
  }
};

const Dashboard = ({ web3context, account, vaults, prices, t }) => {
  const dispatch = useDispatch();

  const [dashboardCurrency, setDashboardCurrency] = useState(
    Number(localStorage.getItem('dashboard-currency')) || currency[0].value
  ); // USD / ETH,
  
  const [dashboardGrowth, setDashboardGrowth] = useState(
    Number(localStorage.getItem('dashboard-growth')) || growth[0].value
  ); // 0 = daily / 1 = weekly / 2 = yearly

  const [dashboardVaults, setDashboardVaults] = useState(null);
  const [dashboardPrices, setDashboardPrices] = useState(null);

  const [profileBalance, setProfileBalance] = useState(0);
  const [profileGrowth, setProfileGrowth] = useState(0);

  const [availableChain, setAvailableChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  const handleCurrencyChange = (value) => {
    setDashboardCurrency(value);

    localStorage.setItem('dashboard-currency', value);
  };

  const handleGrowthChange = (value) => {
    setDashboardGrowth(value);

    localStorage.setItem('dashboard-growth', value);
  };

  const onGetVaultBalances = useCallback(
    (payload) => dispatch(getVaultBalances(payload)),
    [dispatch]
  );

  const onGetUSDPrices = useCallback(
    () => dispatch(getUSDPrices()),
    [dispatch]
  );

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      availableChain &&
      onGetVaultBalances({
        web3: web3context.instance,
        list: availableChain,
        account: account.address
      });
  }, [onGetVaultBalances, account, web3context, availableChain]);

  useEffect(onGetUSDPrices, [onGetUSDPrices]);

  useEffect(() => {
    setDashboardVaults(vaults?.list || null);
    setDashboardPrices(prices?.usd || null);

    if (account?.loading || vaults?.loading || prices?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [account, vaults, prices]);

  useEffect(() => {
    dashboardVaults && dashboardPrices && setDashboard(
      calculateDashboard(dashboardVaults, dashboardPrices, vaults?.basedOn || 0)
    );
  }, [vaults, dashboardVaults, dashboardPrices]);

  useEffect(() => {
    const currentBalance = dashboardCurrency === currency[0].value
      ? dashboard?.portfolio_balance_usd
      : dashboard?.portfolio_balance_eth;

    setProfileBalance(
      parseFloat(currentBalance?.toFixed(2) || 0).toLocaleString()
    );
  }, [dashboardCurrency, dashboard]);

  useEffect(() => {
    let currentBalance;

    switch (dashboardGrowth) {
      case 0:
        currentBalance = dashboardCurrency === currency[0].value
          ? dashboard?.portfolio_growth_usd_daily
          : dashboard?.portfolio_growth_eth_daily;
        break;
      case 1:
        currentBalance = dashboardCurrency === currency[0].value
          ? dashboard?.portfolio_growth_usd_weekly
          : dashboard?.portfolio_growth_eth_weekly;
        break;
      default:
        currentBalance = dashboardCurrency === currency[0].value
          ? dashboard?.portfolio_growth_usd_yearly
          : dashboard?.portfolio_growth_eth_yearly;
    }

    setProfileGrowth(
      parseFloat(currentBalance?.toFixed(2) || 0).toLocaleString()
    );
  }, [dashboardCurrency, dashboardGrowth, dashboard]);

  useEffect(() => {
    web3context?.chain && setAvailableChain(
      getAvailableChain(web3context.chain, vaultsList)
    );
  }, [web3context]);

  return (
    <Typography className={cx(style.container, {
      [style.container_loading]: isLoading
    })}>
      <Title className={style.title}>
        <span id={Dashboard.title}>{t('DASHBOARD_TITLE')}</span>
      </Title>

      <Alert
        className={style.container__info}
        message={t('DASHBOARD_INFO')}
        type="info"
      />

      {account.address ? (
        <>
          {availableChain ? (
            <>
              <Row
                className={style.container__filter}
                justify="end"
                align="middle"
              >
                <Text className={style.container__filter__text}>
                  {`${t('DASHBOARD_FILTER_CURRENCY')}:`}
                </Text>

                <Select
                  dropdownClassName={style.select__dropdown}
                  defaultValue={dashboardCurrency}
                  className={style.select}
                  onChange={handleCurrencyChange}
                >
                  {currency.map(({ value, name }) => (
                    <Option
                      className={cx(style.select__dropdown__option, {
                        [style.select__dropdown__option_selected]:
                          dashboardCurrency === value
                      })}
                      value={value}
                      key={value}
                    >
                      {name}
                    </Option>
                  ))}
                </Select>

                <Text className={style.container__filter__text}>
                  {`${t('DASHBOARD_FILTER_PERIOD')}:`}
                </Text>

                <Select
                  dropdownClassName={style.select__dropdown}
                  defaultValue={dashboardGrowth}
                  className={style.select}
                  onChange={handleGrowthChange}
                >
                  {growth.map(({ value, name }) => (
                    <Option
                      className={cx(style.select__dropdown__option, {
                        [style.select__dropdown__option_selected]:
                          dashboardGrowth === value
                      })}
                      value={value}
                      key={value}
                    >
                      {t(name)}
                    </Option>
                  ))}
                </Select>
              </Row>

              <Row
                className={style.container__balance}
                justify="space-between"
                align="top"
              >
                <Card
                  className={style.container__balance__item}
                  title={`${t('DASHBOARD_PROFILE_BALANCE')}:`}
                >
                  <Text className={style.container__balance__item__value}>
                    {dashboardCurrency === currency[0].value
                      ? `$ ${profileBalance}`
                      : `${profileBalance} ETH`}
                  </Text>
                </Card>

                <Card
                  className={style.container__balance__item}
                  title={`${t(growth[dashboardGrowth || 0].name)}:`}
                >
                  <Text className={style.container__balance__item__value}>
                    {dashboardCurrency === currency[0].value
                      ? `$ ${profileGrowth}`
                      : `${profileGrowth} ETH`}
                  </Text>
                </Card>
              </Row>

              <VaultBasedOn
                className={style.container__prompt}
                isLoading={isLoading}
              />

              {dashboard?.vaults?.length > 0 && (
                <DashboardList
                  currentCurrency={dashboardCurrency}
                  defaultCurrency={currency[0].value}
                  currentBasedOn={vaults?.basedOn || 0}
                  currentGrowth={dashboardGrowth}
                  growthDivider={growth[dashboardGrowth].divider}
                  growthTitle={t(growth[dashboardGrowth || 0].name)}
                  className={style.container__list}
                  isVaults
                  title={t('DASHBOARD_VAULTS_OVERVIEW')}
                  list={dashboard.vaults}
                />
              )}
            </>
          ) : (
            <Alert
              className={style.container__warning}
              message="Dashboard features are not available in this chain."
              type="warning"
            />
          )}

          {/* <AvailableChains configChains={vaultsList} /> */}
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

Dashboard.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  vaults: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(connect(mapState)(Dashboard));
