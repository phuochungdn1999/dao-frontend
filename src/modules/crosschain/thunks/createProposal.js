import { parseErrorTransaction, makeBigNumber } from "../../common";

const createProposal = ({
  web3,
  asset,
  price,
  name,
  description,
  endAt,
  account,
  onError,
  onSuccess,
  onConfirm,
}) => {
  return (dispatch) => {
    // checkApproval(web3, asset, price, amount, account)
    // .then(async () => {
    console.log("RUNNN Vote");
    try {
      console.log("createProposal", asset);
      const bridgeContract = new web3.eth.Contract(
        asset.erc20ABI,
        "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
      );

      bridgeContract.methods
        .createProposal(
          name,
          description,
          endAt
        )
        .send({ from: account, gasPrice: price }) // gwei
        .on("transactionHash", (hash) => {
          onSuccess && onSuccess(hash);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          confirmationNumber === 1 && onConfirm && onConfirm({ receipt });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
        })
        .on("error", (error) => {
          onError && onError(parseErrorTransaction(error));
        });
      // }).catch((error) => onError && onError(error));
    } catch (error) {
      error && onError && onError(error);
    }
  };
  
};

export default createProposal;
