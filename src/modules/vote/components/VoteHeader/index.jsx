import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Row, message } from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CopyOutlined
} from '@ant-design/icons';
import cx from 'classnames';

// helpers:
import { makeShortAddress } from '../../../common';

import style from './VoteHeader.module.scss';

const { info: infoMessage } = message;
const { Paragraph, Text } = Typography;

const copyAddressToClipboard = (event, address) => {
  event.stopPropagation();
  navigator.clipboard.writeText(address).then(() => {
    infoMessage('Address Copied to Clipboard.');
  });
};

const VoteHeader = ({ proposal }) => {
  return (
    <Row className={style.container} justify="space-between" align="top">
      <div className={style.container__status}>
        <Paragraph className={style.title}>Vote Status:</Paragraph>
        <Row align="middle">
          {proposal.myVotes ? (
            proposal.direction === "FOR" ? (
              <CheckCircleOutlined
                className={cx(
                  style.container__status__icon,
                  style.container__status__icon_for
                )}
              />
            ) : proposal.direction === "AGAINST" ? (
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

          <Text className={style.value}>{`Vote #${proposal.id}`}</Text>
        </Row>
      </div>

      {proposal?.proposer && (
        <div className={style.container__proposer}>
          <Paragraph className={style.title}>Proposer:</Paragraph>
          <Row
            className={style.container__proposer__address}
            onClick={(e) => copyAddressToClipboard(e, proposal.proposer)}
            align="middle"
          >
            <Text className={style.value}>
              {makeShortAddress(proposal.proposer)}
            </Text>

            <CopyOutlined
              className={style.container__proposer__address__icon}
            />
          </Row>
        </div>
      )}

      <div className={style.container__for}>
        <Paragraph className={style.title}>
          Votes For
          {' '}
          {proposal.totalForVotes !== '0' ?
            (
              (parseFloat(proposal.totalForVotes) / 10 ** 18) /
                (
                  (parseFloat(proposal.totalForVotes) / 10 ** 18) +
                    (parseFloat(proposal.totalAgainstVotes) / 10 ** 18)
                ) *
                100
            ).toFixed(2) :
            0}
          %
        </Paragraph>
        <Text className={style.value}>
          {proposal.totalForVotes ?
            (parseFloat(proposal.totalForVotes) / 10 ** 18).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 4,
                minimumFractionDigits: 0
              }
            ) :
            0}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>
          Votes Against
          {' '}
          {proposal.totalAgainstVotes !== '0' ?
            (
              (parseFloat(proposal.totalAgainstVotes) / 10 ** 18) /
                (
                  (parseFloat(proposal.totalForVotes) / 10 ** 18) +
                    (parseFloat(proposal.totalAgainstVotes) / 10 ** 18)
                ) *
                100
            ).toFixed(2) :
            0}
          %
        </Paragraph>
        <Text className={style.value}>
          {proposal.totalAgainstVotes ?
            (parseFloat(proposal.totalAgainstVotes) / 10 ** 18).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 4,
                minimumFractionDigits: 0
              }
            ) :
            0}
        </Text>
      </div>
    </Row>
  );
};

VoteHeader.propTypes = {
  proposal: PropTypes.object.isRequired,
};

export default VoteHeader;
