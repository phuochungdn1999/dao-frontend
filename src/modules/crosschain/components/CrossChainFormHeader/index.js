import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Row } from 'antd';
import { SwapOutlined    } from '@ant-design/icons';
import cx from 'classnames';

// img

import ethLogo from './ethereum.png';

import bscLogo from './bsc.png';


import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// configs:
import { crosschain as crosschainList } from '../../../../configs';

import style from './CrossChainFormHeader.module.scss';

const { Text } = Typography;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    chains: state.chains
  };
};

const CrossChainFormHeader = ({ web3context, className, chains, t }) => {
  const [availableChains, setAvailableChains] = useState(null);
  const [fromChain, setFromChain] = useState(null);
  const [toChain, setToChain] = useState(null);

  useEffect(() => {
    if (crosschainList && chains?.list) {
      const findedChains = crosschainList.map(({ id }) => {
        return chains.list?.find((item) => item?.chainId === id);
      });

      setAvailableChains(findedChains || null);
    }
  }, [chains]);

  useEffect(() => {
    if (availableChains && web3context?.chain) {
      const fromChain = availableChains.find(({ chainId }) => {
        return chainId === web3context.chain;
      });

      const toChain = availableChains.find(({ chainId }) => {
        return chainId !== web3context.chain;
      });

      fromChain && setFromChain(fromChain);

      toChain && setToChain(toChain);
    }
  }, [availableChains, web3context]);

  return (
    <Row
      className={cx(className, style.container)}
      justify="space-between"
      align="top"
    >
      <div>
        <Text className={style.title}>
          {t('CROSS_CHAIN_FORM_HEADER_FROM')}
        </Text>

        {fromChain?.name && (
          <Text className={style.value}>
          
            {fromChain.name}
          </Text>
        )}
      </div>

      <div>

        <img  src={ethLogo} className={style.Logo} alt=""/>
          <SwapOutlined    className={style.container__arrow} />
        <img  src={bscLogo} className ="style.Logo" alt=""/>

      </div>

      
   
      <div>
        <Text className={style.title}>
          {t('CROSS_CHAIN_FORM_HEADER_TO')}
        </Text>

        {toChain?.name && (
          <Text className={style.valueTo}>
            {toChain.name}

          </Text>
        )}
      </div>
    </Row>
  );
};

CrossChainFormHeader.propTypes = {
  web3context: PropTypes.object.isRequired,
  className: PropTypes.string,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(connect(mapState)(CrossChainFormHeader));
