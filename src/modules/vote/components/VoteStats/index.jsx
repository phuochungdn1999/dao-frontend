import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Row } from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import cx from 'classnames';

import style from './VoteStats.module.scss';

const { Paragraph, Text } = Typography;

const votingMessage = (proposal, canStillVote) => {
  const message = proposal.myVotes ?
    `You have voted ${proposal.direction}.` :
    'You have not voted.';

  return canStillVote && !proposal.myVotes ?
    `${message} Please vote now.` :
    message;
};

const formatVotes = (votes) => {
  return (votes / 1e18).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    }
  );
};

const formatAsPercent = (ratio) => {
  return (ratio * 100).toFixed(2).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    }
  );
};

const VoteStats = ({ proposal }) => {
  const [currentTimestamp, setCurrentTimestamp] = useState(null);

  useEffect(
    () => setCurrentTimestamp(Math.round(new Date().getTime() / 1000)),
    []
  );

  return (
    <Row className={style.container} justify="space-between" align="top">
      <div>
        <Paragraph className={style.title}>Status:</Paragraph>
        <Row className={style.container__status} align="middle">
          {proposal.myVotes ? (
            proposal.direction === 'FOR' ? (
              <CheckCircleOutlined
                className={cx(
                  style.container__status__icon,
                  style.container__status__icon_for
                )}
              />
            ) : proposal.direction === 'AGAINST' ? (
              <CloseCircleOutlined
                className={cx(
                  style.container__status__icon,
                  style.container__status__icon_against
                )}
              />
            ) : (
              <WarningOutlined
                className={cx(
                  style.container__status__icon,
                  style.container__status__icon_none
                )}
              />
            )
          ) : (
            <WarningOutlined
              className={cx(
                style.container__status__icon,
                style.container__status__icon_none
              )}
            />
          )}

          <Text className={style.value}>
            {votingMessage(proposal, proposal.end > currentTimestamp)}
          </Text>
        </Row>
      </div>

      <div>
        <Paragraph className={style.title}>Used votes:</Paragraph>
        <Text className={style.value}>{formatVotes(proposal.usedVotes)}</Text>
      </div>

      <div>
        <Paragraph className={style.title}>Participation weight:</Paragraph>
        <Text className={style.value}>
          {`${formatAsPercent(proposal.myVotesRatio)}%`}
        </Text>
      </div>
    </Row>
  );
};

VoteStats.propTypes = {
  proposal: PropTypes.object.isRequired
};

export default VoteStats;
