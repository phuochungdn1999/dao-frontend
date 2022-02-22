import React from "react";
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Typography, Card, Row } from 'antd';
import cx from 'classnames';

import { getAPY } from '../../../vaults';

import style from './DashboardList.module.scss';

const { Paragraph, Text } = Typography;

const getGrowth = (
  asset,
  isVaults,
  currentGrowth,
  currentCurrency,
  defaultCurrency
) => {
  let currentVault;

  switch (currentGrowth) {
    case 0:
      currentVault = currentCurrency === defaultCurrency
        ? isVaults ? asset.vaultGrowth_daily_usd : asset.earnGrowth_daily_usd
        : isVaults ? asset.vaultGrowth_daily_eth : asset.earnGrowth_daily_eth;
      break;
    case 1:
      currentVault = currentCurrency === defaultCurrency
        ? isVaults ? asset.vaultGrowth_weekly_usd : asset.earnGrowth_weekly_usd
        : isVaults ? asset.vaultGrowth_weekly_eth : asset.earnGrowth_weekly_eth;
      break;
    default:
      currentVault = currentCurrency === defaultCurrency
        ? isVaults ? asset.vaultGrowth_yearly_usd : asset.earnGrowth_yearly_usd
        : isVaults ? asset.vaultGrowth_yearly_eth : asset.earnGrowth_yearly_eth;
  }

  return parseFloat(currentVault?.toFixed(2) || '0.00').toLocaleString();
};

const setAPY = (asset, currentBasedOn, growthDivider) => {
  return Number(getAPY(asset, currentBasedOn) / growthDivider).toFixed(2);
};

const getMaxApr = (asset, growthDivider) => {
  const { maxApr } = asset;

  return Number(maxApr / growthDivider || '0.00').toFixed(2);
};

const getNetWorth = (asset, currentCurrency, defaultCurrency) => {
  const { usdBalance, ethBalance } = asset;

  const currentBalance = currentCurrency === defaultCurrency
    ? usdBalance
    : ethBalance;

  return parseFloat(currentBalance?.toFixed(2) || '0.00').toLocaleString();
};

const DashboardList = ({
  currentCurrency,
  defaultCurrency,
  currentBasedOn,
  currentGrowth,
  growthDivider,
  growthTitle,
  profitTitle,
  className,
  isVaults,
  title,
  list,
  t
}) => {
  return (
    <Card className={cx(className, style.container)} title={title}>
      {list?.map((asset) => (
        <Row
          className={style.container__row}
          justify="space-between"
          align="middle"
          key={asset.id}
        >
          <img
            className={style.container__row__icon}
            src={`/assets/icons/${asset.symbol.toLowerCase()}.svg`}
            alt={asset.name}
          />
          

          <div className={style.container__row__name}>
            <Paragraph className={style.title}>{asset.name}</Paragraph>
            <Text className={style.value}>{asset.description}</Text>
          </div>

          <div className={style.container__row__growth}>
            <Paragraph className={style.title}>
              {`${growthTitle}:`}
            </Paragraph>
            <Text className={style.value}>
              {` ${isVaults
                ? setAPY(asset, currentBasedOn, growthDivider)
                : getMaxApr(asset, growthDivider)
              }%`}
            </Text>
          </div>
          <div className={style.container__row__growth}>
            <Paragraph className={style.title}>
              {`${profitTitle}:`}
            </Paragraph>
            <Text className={style.value}>
            {currentCurrency === defaultCurrency && '$ '}
            {getGrowth(
                asset,
                isVaults,
                currentGrowth,
                currentCurrency,
                defaultCurrency)}
              {currentCurrency !== defaultCurrency && ' ETH'}
            </Text>
          </div>

          <div className={style.container__row__worth}>
            <Paragraph className={style.title}>
              {`${t('DASHBOARD_NEW_WORTH')}:`}
            </Paragraph>
            <Text className={style.value}>
              {currentCurrency === defaultCurrency
                ? `$ ${getNetWorth(asset, currentCurrency, defaultCurrency)}`
                : `${getNetWorth(asset, currentCurrency, defaultCurrency)} ETH`}
            </Text>
          </div>
        </Row>
      ))}
    </Card>
  );
};

DashboardList.propTypes = {
  defaultCurrency: PropTypes.number.isRequired,
  currentCurrency: PropTypes.number.isRequired,
  currentBasedOn: PropTypes.number.isRequired,
  currentGrowth: PropTypes.number.isRequired,
  growthDivider: PropTypes.number.isRequired,
  growthTitle: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  isVaults: PropTypes.bool,
  title: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(DashboardList);
