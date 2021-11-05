import CryptoJS from 'crypto-js';

import { parseErrorTransaction } from '../../common';

const generateHash = (text) => {
  return new Promise((resolve) => {
    const cid = CryptoJS
      .AES
      .encrypt(text, process.env.REACT_APP_PROPOSAL_SECRET_PHRASE)
      .toString();

    resolve(cid);
  });
};

const callPropose = (
  web3,
  hash,
  asset,
  account,
  onError,
  onSuccess,
  onConfirm
) => {
  try {
    const governanceContract = new web3.eth.Contract(
      asset.governanceABI,
      asset.governanceAddress
    );

    governanceContract
      .methods
      .propose(hash)
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

const createPropose = ({
  web3,
  text,
  asset,
  account,
  onError,
  onSuccess,
  onConfirm
}) => {
  return (dispatch) => {
    generateHash(text).then((hash) => {
      callPropose(web3, hash, asset, account, onError, onSuccess, onConfirm);
    }).catch((error) => {
      onError && onError(error);
    });
  };
};

export default createPropose;
