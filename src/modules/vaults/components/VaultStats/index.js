import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Row } from 'antd';

import style from './VaultStats.module.scss';

const { Paragraph, Title, Text } = Typography;

const VaultStats = ({ asset }) => {
  return (
    <div className={style.container}>
      <Title className={style.title} level={5}>Statistics:</Title>
    
      <Row className={style.row} justify="space-between">
        <div>
        <div>
          <div>
            <Paragraph className={style.title}>Available:</Paragraph>
            <Text className={style.value}>
              {`${Number(asset.available || 0).toFixed(2)} ${asset.symbol}`}
            </Text>
          </div>
        

          <div>
            <Paragraph className={style.title}>Vault Balance:</Paragraph>
            <Text className={style.value}>
              {`${Number(asset.wholeVaultBalance || 0).toFixed(2)} ${asset.symbol}`}
            </Text>
          </div>

          <div>
            <Paragraph className={style.title}>Price Per Full Share:</Paragraph>
            <Text className={style.value}>
              {`${Number(asset.pricePerFullShare || 0).toFixed(2)} ${asset.symbol}`}
            </Text>
          </div>
        </div>
        </div>




        <div>
          <div>
            <Paragraph className={style.title}>Max:</Paragraph>
            <Text className={style.value}>
              {`${asset.max || 0}%`}
            </Text>
          </div>

          <div>
            <Paragraph className={style.title}>Min:</Paragraph>
            <Text className={style.value}>
              {`${asset.min || 0}%`}
            </Text>
          </div>

          <div>
            <Paragraph className={style.title}>Total Supply:</Paragraph>
            <Text className={style.value}>
              {`${Number(asset.totalSupply || 0).toFixed(2)} ${asset.symbol}`}
            </Text>
          </div>
        </div>
      </Row>
    </div>
  );
};

VaultStats.propTypes = {
  asset: PropTypes.object.isRequired
};

export default VaultStats;
