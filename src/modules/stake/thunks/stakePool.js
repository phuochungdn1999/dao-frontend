import { parseErrorTransaction, makeBigNumber } from '../../common';

const checkApproval = async (web3, asset, amount, account) => {
  const governanceContract = new web3.eth.Contract(
    asset.governanceABI,
    asset.governanceAddress
  );

  const token = await governanceContract
    .methods
    .getStakingToken()
    .call({ from: account });

  const approveContract = new web3.eth.Contract(asset.tokenABI, token);

  const allowance = await approveContract
    .methods
    .allowance(account, asset.governanceAddress)
    .call({ from: account });

  const ethAllowance = Number(asset.decimals) === 18 ?
    web3.utils.fromWei(allowance, 'ether') :
    (allowance * 10 ** asset.decimals).toFixed(0);

  if (parseFloat(ethAllowance) < parseFloat(amount)) {
    await approveContract
      .methods
      .approve(
        asset.governanceAddress,
        makeBigNumber(web3, amount, asset.decimals)
      )
      .send({ from: account });

    return;
  } else {
    return;
  }
};

const callStake = (
  web3,
  asset,
  price,
  amount,
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
      .stake(makeBigNumber(web3, amount, asset.decimals))
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

const stakePool = ({
  web3,
  asset,
  price,
  amount,
  account,
  onError,
  onSuccess,
  onConfirm
}) => {
  return (dispatch) => {
    checkApproval(web3, asset, amount, account).then(() => {
      callStake(
        web3,
        asset,
        price,
        amount,
        account,
        onError,
        onSuccess,
        onConfirm
      );
    }).catch((error) => {
      error && onError && onError(error);
    });
  };
};

export default stakePool;
