import { makeBigNumber } from '../../common';

const checkApproval = ({
  web3,
  asset,
  price,
  amount,
  account,
  onError,
  onSuccess
}) => {
  return async (dispatch) => {
    if (asset?.erc20address === 'Ethereum') {
      onSuccess && onSuccess();
    } else {
      try {
        const erc20Contract = new web3.eth.Contract(
          asset.erc20ABI,
          asset.erc20address
        );

        const allowance = await erc20Contract
          .methods
          .allowance(account, asset.vaultContractAddress)
          .call({ from: account });

        const ethAllowance = Number(asset.decimals) === 18 ?
          web3.utils.fromWei(allowance, 'ether') :
          (allowance * 10 ** asset.decimals).toFixed(0);

        if (parseFloat(ethAllowance) < parseFloat(amount)) {
          if (['USDT', 'sCRV'].includes(asset.id) && ethAllowance) {
            await erc20Contract
              .methods
              .approve(
                asset.vaultContractAddress,
                makeBigNumber(web3, 0, asset.decimals)
              )
              .send({ from: account, gasPrice: price }); // gwei
          } else {
            await erc20Contract
              .methods
              .approve(
                asset.vaultContractAddress,
                makeBigNumber(web3, amount, asset.decimals)
              )
              .send({ from: account, gasPrice: price }); // gwei
          }

          onSuccess && onSuccess();
        } else {
          onSuccess && onSuccess();
        }
      } catch (error) {
        error?.message && console.error(error?.message);

        onError && onError(error);
      }
    }
  };
};

export default checkApproval;
