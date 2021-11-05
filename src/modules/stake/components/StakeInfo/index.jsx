import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Row } from 'antd';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import cx from 'classnames';

import style from './StakeInfo.module.scss';

const { Paragraph, Text } = Typography;

const StakeInfo = ({ isVoteLockValid, pool }) => {
  return (
    <Row className={style.container}  justify="space-between" align="top">
      <div>
        <Paragraph className={style.title}>Your Balance:</Paragraph>
        <Text className={style.value}>
          {pool?.tokens[0]?.balance?.toFixed(2) || 0}
          {' '}
          {pool?.tokens[0]?.symbol}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>Currently Staked:</Paragraph>
        <Text className={style.value}>
          {pool?.tokens[0]?.stakedBalance?.toFixed(2) || 0}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>Rewards Available:</Paragraph>
        <Text className={style.value}>
          {pool?.tokens[0].rewardsSymbol === '$' &&
            pool?.tokens[0].rewardsSymbol}
          {' '}
          {pool?.tokens[0]?.rewardsAvailable?.toFixed(2) || 0}
          {' '}
          {pool?.tokens[0].rewardsSymbol !== '$' &&
            pool?.tokens[0].rewardsSymbol}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>Reward requirements:</Paragraph>
        <Paragraph className={style.propmt}>
          {isVoteLockValid ? (
            <CheckCircleOutlined
              className={cx(style.propmt__icon, style.propmt__icon_ok)}
            />
          ) : (
            <CloseOutlined
              className={cx(style.propmt__icon, style.propmt__icon_error)}
            />
          )}

          <Text className={style.value}>
            You must have voted in a proposal recently
          </Text>
        </Paragraph>

        {/* TODO: Check it after complete rewards at contracts */}
        {/* <Paragraph className={style.container__propmt}>
          <Text>
            You must have at least 1000 BPT staked in the Governance pool
          </Text>

          {isBalanceValid ? (
            <CheckCircleOutlined
              className={cx(
                style.container__propmt__icon,
                style.container__propmt__icon_ok
              )}
            />
          ) : (
            <CloseOutlined
              className={cx(
                style.container__propmt__icon,
                style.container__propmt__icon_error
              )}
            />
          )}
        </Paragraph> */}
      </div>
    </Row>
  );
};

StakeInfo.propTypes = {
  isVoteLockValid: PropTypes.bool.isRequired,
  pool: PropTypes.object.isRequired
};

export default StakeInfo;
