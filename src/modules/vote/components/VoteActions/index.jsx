import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { Button, Row, message } from 'antd';

// configs:
import { pools as poolsList } from '../../../../configs';

// thunks:
import { revokeProposal, getProposals, voteAgainst, voteFor } from '../../';

import style from './VoteActions.module.scss';

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage
} = message;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account
  };
};

const VoteActions = ({ web3context, proposal, account }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleRevokeProposal = () => {
    setIsLoading(true);

    const result = poolsList.find(({ id }) => id === web3context?.chain);

    web3context?.instance &&
      proposal?.id &&
      account?.address &&
      result?.list &&
      dispatch(
        revokeProposal({
          web3: web3context.instance,
          asset: result.list[0].tokens[0],
          account: account.address,
          proposalId: proposal.id,
          onError: (error) => {
            if (error?.message) {
              console.error(error.message);

              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage('Proposal revoked successful.');

            dispatch(getProposals({
              web3: web3context.instance,
              asset: result.list[0].tokens[0],
              account: account.address
            }));
          },
          onSuccess: (result) => {
            successMessage(
              'The transaction to revoke proposal was sent successfully.'
            );

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);
          }
        })
      );
  };

  const handleVoteAgainst = () => {
    setIsLoading(true);

    const result = poolsList.find(({ id }) => id === web3context?.chain);

    web3context?.instance &&
      proposal?.id &&
      account?.address &&
      result?.list &&
      dispatch(
        voteAgainst({
          web3: web3context.instance,
          asset: result.list[0].tokens[0],
          account: account.address,
          proposalId: proposal.id,
          onError: (error) => {
            if (error?.message) {
              console.error(error.message);

              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage('The vote against was successful.');

            dispatch(getProposals({
              web3: web3context.instance,
              asset: result.list[0].tokens[0],
              account: account.address
            }));
          },
          onSuccess: (result) => {
            successMessage(
              'The transaction to vote against was sent successfully.'
            );

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);
          }
        })
      );
  };

  const handleVoteFor = () => {
    setIsLoading(true);

    const result = poolsList.find(({ id }) => id === web3context?.chain);

    web3context?.instance &&
      proposal?.id &&
      account?.address &&
      result?.list &&
      dispatch(
        voteFor({
          web3: web3context.instance,
          asset: result.list[0].tokens[0],
          account: account.address,
          proposalId: proposal.id,
          onError: (error) => {
            if (error?.message) {
              console.error(error.message);

              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage('The vote against was successful.');

            dispatch(getProposals({
              web3: web3context.instance,
              asset: result.list[0].tokens[0],
              account: account.address
            }));
          },
          onSuccess: (result) => {
            successMessage('The transaction to vote for was sent successfully.');

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);
          }
        })
      );
  };

  useEffect(
    () => account?.loading ? setIsLoading(true) : setIsLoading(false),
    [account]
  );

  return (
    <Row className={style.container} align="middle">
      <Button
        className={style.button}
        disabled={isLoading}
        loading={isLoading}
        onClick={handleVoteFor}
      >
        Vote For ✔
      </Button>

      <Button
        className={style.button}
        disabled={isLoading}
        loading={isLoading}
        onClick={handleVoteAgainst}
      >
        Vote Against ✖
      </Button>

      {proposal.proposer.toLowerCase() ===
        account?.address.toLowerCase() && (
        <Button
          className={style.button}
          disabled={isLoading}
          loading={isLoading}
          onClick={handleRevokeProposal}
        >
          Revoke Proposal
        </Button>
      )}
    </Row>
  );
};

VoteActions.propTypes = {
  web3context: PropTypes.object.isRequired,
  proposal: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
};

export default connect(mapState)(VoteActions);
