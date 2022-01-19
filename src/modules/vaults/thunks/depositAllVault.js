import { parseErrorTransaction } from '../../common';

const depositAllVault = ({
  web3,
  asset,
  account,
  price,
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
        .depositAll()
        .send({ from: account, gasPrice: price }) // gwei
        .on('transactionHash', (hash) => {

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

export default depositAllVault;
