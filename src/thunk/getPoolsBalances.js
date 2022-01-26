import async from 'async';

import { actionTypes } from '../modules/stake/reducers/pools';

const getPoolDecimals = async (web3, asset, account) => {
  const tokenContract = new web3.eth.Contract(
    asset.tokenABI,
    asset.tokenAddress
  );

  const decimals = await tokenContract
    .methods
    .decimals()
    .call({ from: account });

  return decimals;
};

export const getUserBalance = async (web3, asset, account, callback) => {
  try {
    const tokenContract = new web3.eth.Contract(
      asset.tokenABI,
      asset.tokenAddress
    );

    const balance = await tokenContract
      .methods
      .balanceOf(account)
      .call({ from: account });

    return 
    
  } catch(error) {
    console.error(error?.message);
    callback(error, 0);
  }
};

const getStakedBalance = async (web3, asset, account, callback) => {
  try {
    const governanceContract = new web3.eth.Contract(
      asset.governanceABI,
      asset.governanceAddress
    );

    const balance = await governanceContract
      .methods
      .balanceOf(account)
      .call({ from: account });
    
    callback(null, parseFloat(balance) / 10 ** asset.decimals);
  } catch(error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

export const getGovernaceContract = (web3, asset) => {
  try {
    const governanceContract = new web3.eth.Contract(
      asset.governanceABI,
      asset.governanceAddress
    );

    return governanceContract;
    
  } catch(error) {
    console.error(error?.message);
  }
}

const getRewardsAvailable = async (web3, asset, account, callback) => {
  try {
    const governanceContract = getGovernaceContract(web3, asset);

    const earned = await governanceContract
      .methods
      .earned(account)
      .call({ from: account });
    callback(null, parseFloat(earned) / 10 ** asset.decimals);
  } catch(error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getPoolsBalances = ({ web3, list, account }) => {
  return (dispatch) => {

    web3 && list && account && dispatch({
      type: actionTypes.UPDATE_POOLS_LOADING,
      payload: true
    });

    web3 && list && account && async.map(list, (pool, callback) => {
      async.map(pool.tokens, (token, callbackInner) => {
        getPoolDecimals(web3, token, account).then((decimals) => {
          token.decimals = decimals;

          async.parallel([
            (callbackInnerInner) => {
              getUserBalance(web3, token, account, callbackInnerInner);
            },
            (callbackInnerInner) => {
              getStakedBalance(web3, token, account, callbackInnerInner);
            },
            (callbackInnerInner) => {
              getRewardsAvailable(web3, token, account, callbackInnerInner);
            }
          ], (error, data) => {
            if (error) {
              return callbackInner(error);
            }
            token.balance = data[0];
            token.stakedBalance = data[1];
            token.rewardsAvailable = data[2];
            callbackInner(null, token);
          })
        }).catch((error) => callback(error));
      }, (err, tokensData) => {
        if(err) {
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (error, pools) => {
      error && console.error(error?.message);
      !error && pools && dispatch({
        type: actionTypes.UPDATE_POOLS_LIST,
        payload: pools
      });


      dispatch({ type: actionTypes.UPDATE_POOLS_LOADING, payload: false });
    });
  };
};

export default getPoolsBalances;
