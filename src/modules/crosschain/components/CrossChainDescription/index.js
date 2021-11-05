import React from 'react';
import { withTranslation } from 'react-i18next';
import { Typography, Card } from 'antd';

import style from './CrossChainDescription.module.scss';

const { Paragraph } = Typography;

const CrossChainDescription = ({ t }) => {
  return (
    <Card className={style.container} title={t('CROSS_CHAIN_FAQ_TITLE')}>
      {t('CROSS_CHAIN_FAQ_DESCRIPTION')?.split('\n')?.map((item, index) => {
        return item.length && (
          <Paragraph className={style.description} key={index}>
            {item}
          </Paragraph>
        );
      })}
    </Card>
  );
};

export default withTranslation()(CrossChainDescription);
