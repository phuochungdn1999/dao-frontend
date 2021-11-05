import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography, Row } from 'antd';

import style from './VoteInfo.module.scss';

const { Paragraph, Text } = Typography;

const VoteInfo = ({ proposal }) => {
  return (
    <Row className={style.container} justify="space-between" align="top">
      <div className={style.container__description}>
        <Paragraph className={style.title}>Description:</Paragraph>
        <Text className={style.value}>
          {proposal.description || 'Vote has no description.'}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>Vote Start:</Paragraph>
        <Text className={style.value}>
          {proposal.start &&
            `${moment(proposal.start * 1000).format('YYYY/MM/DD kk:mm')}`}
        </Text>
      </div>

      <div>
        <Paragraph className={style.title}>Vote End:</Paragraph>
        <Text className={style.value}>
          {proposal.end > 0 ?
            `${moment(proposal.end * 1000).format("YYYY/MM/DD kk:mm")}` :
            'Ended'}
        </Text>
      </div>
    </Row>
  );
};

VoteInfo.propTypes = {
  proposal: PropTypes.object.isRequired
};

export default VoteInfo;
