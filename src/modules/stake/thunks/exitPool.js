import { parseErrorTransaction } from "../../common";

const callExit = async (web3, asset, price, account, callback) => {
  const curveContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  curveContract.methods
    .exit()
    .send({ from: account, gasPrice: web3.utils.toWei(price, "gwei") })
    .on("transactionHash", (hash) => {
      callback(null, hash);
    })
    .on("confirmation", (confirmationNumber, receipt) => {
      console.log("confirmation", confirmationNumber, receipt);

      // confirmationNumber === 2 && dispatcher.dispatch({ type: GET_BALANCES });
    })
    .on("receipt", (receipt) => {
      console.log("receipt", receipt);
    })
    .on("error", (error) => {
      callback(parseErrorTransaction(error));
    });
};

const exitPool = ({ web3, asset, price, account, onError, onSuccess }) => {
  return (dispatch) => {
    callExit(web3, asset, price, account, (error, exitResult) => {
      error && onError && onError(error);

      exitResult && onSuccess && onSuccess(exitResult);
    });
  };
};

export default exitPool;
