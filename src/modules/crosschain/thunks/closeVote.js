import { parseErrorTransaction } from '../../common';


const closeVote = ({
  web3,
  asset,
  price,
  account,
  vote,
  onError,
  onSuccess,
  onConfirm
}) => {
  return (dispatch) => {
    // checkApproval(web3, asset, price, amount, account)
    // .then(async () => {
      console.log("RUNNN Vote")
      try {
        console.log('sendVotes', asset)
        const bridgeContract = new web3.eth.Contract(
          asset.erc20ABI,
      "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
          );
            bridgeContract
              .methods
              .closeProposal(
                vote.proposalId
              )
              .send({ from: account, gasPrice: price }) // gwei
              .on('transactionHash', (hash) => {

                onSuccess && onSuccess(hash);
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                confirmationNumber === 1 &&
                  onConfirm &&
                  onConfirm({  receipt });
              })
              .on('receipt', (receipt) => {
                console.log('receipt', receipt);
              })
              .on('error', (error) => {
                onError && onError(parseErrorTransaction(error));
              });
          // }).catch((error) => onError && onError(error));
        } catch (error) {
          error && onError && onError(error);
        }
      }
      // )
      // .catch((error) => onError && onError(error));
  };
// };

export default closeVote;
