import { parseErrorTransaction, makeBigNumber } from '../../common';

const checkApproval = async (web3, asset, price, amount, account) => {
  const erc20Contract = new web3.eth.Contract(
    asset.erc20ABI,
    asset.erc20address
  );

  const allowance = await erc20Contract
    .methods
    .allowance(account, asset.bridgeAddress)
    .call({ from: account });

  const ethAllowance = Number(asset.decimals) === 18 ?
    web3.utils.fromWei(allowance, 'ether') :
    (allowance * 10 ** asset.decimals).toFixed(0);

  if (parseFloat(ethAllowance) < parseFloat(amount)) {
    await erc20Contract
      .methods
      .approve(asset.bridgeAddress, makeBigNumber(web3, amount, asset.decimals))
      .send({ from: account, gasPrice: price }); // gwei

    return;
  } else {
    return;
  }
};

const sendVotes = ({
  web3,
  asset,
  price,
  amount,
  address,
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
          
          // const nonce = await bridgeContract
          // .methods
          // .GetTransactionId()
          // .call({ from: account });
          
          // const message = web3.utils.soliditySha3(
          //   { t: 'address', v: account} ,
          //   { t: 'address', v: address },
          //   { t: 'uint256', v: web3.utils.toWei(amount.toString(), 'ether') },
          //   { t: 'uint256', v: nonce }
          // ).toString('hex');
          //   console.log("-------------------------------------------")
          // web3.eth.personal.sign(message, account).then((signature) => {
            console.log("1111111111111111", vote.value)
            bridgeContract
              .methods
              .vote(
                vote.proposalId,
                Boolean(vote.value),
                // signature
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

export default sendVotes;
