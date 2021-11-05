import { parseErrorTransaction } from '../../common';

const callGetReward = async (web3, asset, price, account, callback) => {
  const curveContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  curveContract
    .methods
    .getReward()
    .send({ from: account, gasPrice: web3.utils.toWei(price, 'gwei') })
    .on('transactionHash', (hash) => {
      console.log('transactionHash', hash);

      callback(null, hash);
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log('confirmation', confirmationNumber, receipt);

      // confirmationNumber === 2 && dispatcher.dispatch({ type: GET_BALANCES });
    })
    .on('receipt', (receipt) => {
      console.log('receipt', receipt);
    })
    .on('error', (error) => {
      callback(parseErrorTransaction(error));
    });
};

const claimPool = ({ web3, asset, price, account, onError, onSuccess }) => {
  return (dispatch) => {
    callGetReward(web3, asset, price, account, (error, claimResult) => {
      error && onError && onError(error);

      claimResult && onSuccess && onSuccess(claimResult);
    });
  };
};

export default claimPool;
