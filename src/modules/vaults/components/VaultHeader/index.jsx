import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip, Row } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { getAPY } from '../../';

import style from './VaultHeader.module.scss';

const { Paragraph, Text } = Typography;

const VaultHeader = ({ asset, basedOn }) => {
  return (
    <Row className={style.container} justify="space-between" align="top">
      <img
        className={style.container__icon}
        style={asset.disabled ?
          { filter: 'grayscale(100%)' } :
          {}
        }
        src="assets/icons/wbtc.svg"
        alt={asset.name}
      />
      

      <div className={style.container__name}>
        <Paragraph className={style.title}>{asset.name}</Paragraph>
        <Text className={style.value}>{asset.description}</Text>
      </div>
      

      <div className={style.container__growth}>
        <Paragraph className={style.title}>APY:</Paragraph>

        {!['GUSD', 'LINK'].includes(asset.id) && asset.vaultBalance > 0 && (
          <Text className={style.value}>
            {`${(getAPY(asset, basedOn) / 1).toFixed(2)}%`}
            {' '}
            on
            {' '}
            {asset.vaultBalance ?
              (Math.floor(
                asset.vaultBalance * asset.pricePerFullShare * 10000
              ) / 10000).toFixed(2) :
              '0.00'}
            {' '}
            {asset.symbol}
          </Text>
        )}

        {!['GUSD', 'LINK'].includes(asset.id) && asset.vaultBalance === 0 && (
          <Text className={style.value}>
            {`${(getAPY(asset, basedOn) / 1).toFixed(2)} %`}
          </Text>
        )}

        {asset.id === 'LINK' && (
          <Text className={style.value}>Not Available</Text>
        )}

        {asset.id === 'GUSD' && (
          <Row>
            <Text className={style.value}>Not Available</Text>
            <Tooltip
              title="The GUSD strategy is temporally disabled due to misleading APY calculation. It is safe to withdraw your funds, you are not charged 0.5% withdrawal fee."
            >
              <InfoCircleOutlined />
            </Tooltip>
          </Row>
        )}
      </div>

      {asset.depositDisabled ? (
        <div className={style.container__available}>
          <Tooltip
            title="This vault is currently inactive and is not taking deposits."
          >
            <Row>
              <QuestionCircleOutlined />
              <Text>Inactive</Text>
            </Row>
          </Tooltip>
        </div>
      ) : (
        <div className={style.container__available}>
          <Paragraph className={style.title}>Available to deposit:</Paragraph>
          <Text className={style.value}>
            {asset.balance ? (asset.balance).toFixed(2) : '0.00'}
            {' '}
            {asset.symbol}
          </Text>
        </div>
      )}
    </Row>
  );
};

VaultHeader.propTypes = {
  basedOn: PropTypes.number.isRequired,
  asset: PropTypes.object.isRequired
};

export default VaultHeader;
