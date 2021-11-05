import { parseErrorTransaction } from '../../common';

const pauseVault = ({ web3, asset, price, account, onError, onSuccess }) => {
  return (dispatch) => {
    try {
      const vaultContract = new web3.eth.Contract(
        asset.vaultContractABI,
        asset.vaultContractAddress
      );

      vaultContract
        .methods
        .pause()
        .send({ from: account, gasPrice: price }) // gwei
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash);

          onSuccess && onSuccess(hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log('confirmation', confirmationNumber, receipt);
        })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt);
        })
        .on('error', (error) => {
          onError && onError(parseErrorTransaction(error));
        });
    } catch (error) {
      error && onError && onError(error);
    }
  };
};

export default pauseVault;
