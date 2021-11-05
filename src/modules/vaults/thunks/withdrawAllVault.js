import { parseErrorTransaction } from '../../common';

const withdrawAllVault = ({
  web3,
  asset,
  price,
  account,
  onError,
  onSuccess,
  onConfirm
}) => {
  return (dispatch) => {
    try {
      const vaultContract = new web3.eth.Contract(
        asset.vaultContractABI,
        asset.vaultContractAddress
      );

      vaultContract
        .methods
        .withdrawAll()
        .send({ from: account, gasPrice: price }) // gwei
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
      error && onError && onError(error);
    }
  };
};

export default withdrawAllVault;
