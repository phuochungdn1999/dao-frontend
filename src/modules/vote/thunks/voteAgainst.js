import { parseErrorTransaction } from '../../common';

const voteAgainst = ({
  web3,
  asset,
  account,
  proposalId,
  onError,
  onSuccess,
  onConfirm
}) => {
  return async (dispatch) => {
    try {
      const governanceContract = new web3.eth.Contract(
        asset.governanceABI,
        asset.governanceAddress
      );

      governanceContract
        .methods
        .voteAgainst(proposalId)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash);

          onSuccess && onSuccess(hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          confirmationNumber === 2 && onConfirm && onConfirm(receipt);
        })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt);
        })
        .on('error', (error) => {
          onError && onError(parseErrorTransaction(error));
        });
    } catch (error) {
      onError && onError(error);
    }
  };
};

export default voteAgainst;
