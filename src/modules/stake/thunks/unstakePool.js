import { parseErrorTransaction, makeBigNumber } from "../../common";

const unstakePool = ({
  web3,
  asset,
  price,
  amount,
  account,
  onError,
  onSuccess,
  onConfirm,
}) => {
  return (dispatch) => {
    const governanceContract = new web3.eth.Contract(
      asset.governanceABI,
      asset.governanceAddress
    );

    governanceContract.methods
      .withdraw(makeBigNumber(web3, amount, asset.decimals))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        onSuccess && onSuccess(hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        confirmationNumber === 2 && onConfirm && onConfirm(receipt);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
      })
      .on("error", (error) => {
        onError && onError(parseErrorTransaction(error));
      });
  };
};

export default unstakePool;
