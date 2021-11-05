import React from 'react';
import { Typography, Card } from 'antd';


import style from './VaultDescription.module.scss';

const { Paragraph } = Typography;

const VaultDescription = () => {
  return (
    <Card className={style.container} title="Strategy Rewards">
      <Paragraph className={style.description}>
        Yearn is only possible due to community contributions. Vault strategy
        contributors are rewarded with 0.5% of yield generated by the vault.
      </Paragraph>
    </Card>
  );
};

export default VaultDescription;
