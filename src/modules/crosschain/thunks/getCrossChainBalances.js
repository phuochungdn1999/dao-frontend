import { actionTypes } from '../reducers/crosschain';

const getTokenDecimals = async (web3, asset, account) => {
  const tokenContract = new web3.eth.Contract(
    asset.erc20ABI,
    asset.erc20address
  );

  const decimals = await tokenContract
    .methods
    .decimals()
    .call({ from: account });

  return decimals;
};

const getUserBalance = async (web3, asset, account) => {
  const tokenContract = new web3.eth.Contract(
    asset.erc20ABI,
    asset.erc20address
  );

  const balance = await tokenContract
    .methods
    .balanceOf(account)
    .call({ from: account });

  return parseFloat(balance) / 10 ** asset.decimals;
};

const getCrossChainBalances = ({ web3, asset, account }) => {
  return (dispatch) => {
    web3 && asset && account && dispatch({
      type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
      payload: true
    });

    web3 && asset && account && getTokenDecimals(web3, asset, account)
      .then((decimals) => {
        asset.decimals = decimals;

        getUserBalance(web3, asset, account).then((balance) => {
          asset.balance = balance;

          dispatch({
            type: actionTypes.CROSSCHAIN_CHAIN_UPDATE,
            payload: asset
          });

          dispatch({
            type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
            payload: false
          });
        }).catch((error) => {
          console.error(error?.message || error);

          dispatch({
            type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
            payload: false
          });
        });
      })
      .catch((error) => {
        console.error(error?.message || error);

        dispatch({
          type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
          payload: false
        });
      });
  };
};

export default getCrossChainBalances;
