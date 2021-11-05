import { parseErrorTransaction, makeBigNumber } from '../../common';

const withdrawVault = ({
  web3,
  asset,
  account,
  amount,
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
        .withdraw(makeBigNumber(web3, amount, asset.decimals))
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

export default withdrawVault;
