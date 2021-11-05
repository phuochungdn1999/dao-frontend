import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Collapse, Alert, Empty, Row } from 'antd';
import {  LoadingOutlined } from '@ant-design/icons';
import cx from 'classnames';

// configs:
import { pools as poolsList } from '../../../../configs';

// components:
import { AvailableChains } from '../../../common';
import {
  VoteActions,
  VoteHeader,
  VoteCreate,
  VoteStats,
  VoteInfo,
  VoteTabs
} from '../../';

// helpers:
import { getAvailableChain } from '../../../common';

// thunks:
import { getProposals } from '../../';

import style from './Vote.module.scss';

const { Title } = Typography;
const { Panel } = Collapse;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    proposals: state.proposals,
    account: state.account
  };
};

const Vote = ({ web3context, proposals, account, t }) => {
  const dispatch = useDispatch();

  const [filteredProposals, setFilteredProposals] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [availableChain, setAvailableChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetProposals = useCallback(
    (payload) => dispatch(getProposals(payload)),
    [dispatch]
  );

  useEffect(() => {
    if (proposals?.loading || account?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [account, proposals]);

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      availableChain &&
      onGetProposals({
        web3: web3context.instance,
        asset: availableChain[0].tokens[0],
        account: account.address
      });
  }, [onGetProposals, account, web3context, availableChain]);

  useEffect(() => {
    const filteredProposals = proposals?.list?.filter(({ proposer }) => {
      return proposer !== '0x0000000000000000000000000000000000000000';
    }).filter(({ end }) => {
      return proposals?.tab ? end > currentTimestamp : end < currentTimestamp;
    }) || null;

    setFilteredProposals(filteredProposals);
  }, [currentTimestamp, proposals]);

  useEffect(
    () => setCurrentTimestamp(Math.round(new Date().getTime() / 1000)),
    []
  );

  useEffect(() => {
    web3context?.chain && setAvailableChain(
      getAvailableChain(web3context.chain, poolsList)
    );
  }, [web3context]);

  return (
    <Typography className={cx(style.container, {
      [style.container_loading]: isLoading
    })}>
      <Title className={style.title}>
        <span>{t('VOTE_TITLE')}</span>
        <Alert
        className={style.container__info}
        message={t('DASHBOARD_INFO')}
        type="info"
      />
      </Title>

      

      {account?.address ? (
        <>
          {availableChain ? (
            
            <>
            {/* <Alert
              className={style.container__warning}
              message="Voting feature will be available soon."
              type="warning"
            /> */}
              <Row
                className={style.container__actions}
                justify="space-between"
                align="middle"
              >
                <VoteTabs isDisabled={isLoading} />

                <VoteCreate isDisabled={isLoading} />
              </Row>

              {filteredProposals?.length ? (
                <Collapse className={style.list} accordion bordered={false}>
                  {filteredProposals.map((proposal) => (
                    <Panel
                      header={
                        <VoteHeader proposal={proposal} />
                      }
                      key={proposal.id}
                    >
                      <VoteInfo proposal={proposal} />

                      <VoteStats proposal={proposal} />

                      {currentTimestamp && proposal.end > currentTimestamp && (
                        <VoteActions proposal={proposal} />
                      )}
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Row
                  description="No proposals yet"
                  className={style.container__empty}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </>
          ) : (
            <Alert
              className={style.container__warning}
              message="Voting feature will be available soon."
              type="warning"
            />
          )}

          {/* <AvailableChains configChains={poolsList} /> */}
        </>
      ) : (
        <Alert
          className={style.container__warning}
          message="Please, connect your wallet to continue."
          type="warning"
        />
      )}

      {isLoading && (
        <div className={style.container__loading}>
          <LoadingOutlined className={style.container__loading__icon} />
        </div>
      )}
    </Typography>
  );
};

Vote.propTypes = {
  web3context: PropTypes.object.isRequired,
  proposals: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(connect(mapState)(Vote));
