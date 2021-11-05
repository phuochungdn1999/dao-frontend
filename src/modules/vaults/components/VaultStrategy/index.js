import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Row } from 'antd';

import { getAPY } from '../../';

import style from './VaultStrategy.module.scss';

const { Paragraph, Title, Text } = Typography;

const VaultStrategy = ({ basedOn, asset }) => {
  return (
    <div className={style.container}>
      <div>
          <Title title className={style.title} level={5}>Strategy:</Title>
          <Text className={style.value}>{asset.strategyName}</Text>
      </div>
      <Row className={style.row} justify="space-between">
    

        <div>
          <Paragraph className={style.title}>Yearly Growth:</Paragraph>
          <Text className={style.value}>
            {`${(getAPY(asset, basedOn) / 1).toFixed(2)}%`}
          </Text>
        </div>

        <div>
          <Paragraph className={style.title}>Monthly Growth:</Paragraph>
          <Text className={style.value}>
            {`${(getAPY(asset, basedOn) / 12).toFixed(2)}%`}
          </Text>
        </div>

        <div>
          <Paragraph className={style.title}>Weekly Growth:</Paragraph>
          <Text className={style.value}>
            {`${(getAPY(asset, basedOn) / 52).toFixed(2)}%`}
          </Text>
        </div>
      </Row>
    </div>
  );
};

VaultStrategy.propTypes = {
  basedOn: PropTypes.number.isRequired,
  asset: PropTypes.object.isRequired
};

export default VaultStrategy;
