import moment from 'moment';
import axios from 'axios';
import async from 'async';

import { actionTypes } from '../reducers/vaults';

const getVaultDecimals = async (web3, asset, account) => {
  const vaultContract = new web3.eth.Contract(
    asset.vaultContractABI,
    asset.vaultContractAddress
  );

  const decimals = await vaultContract
    .methods
    .decimals()
    .call({ from: account });

  return decimals;
};

const getAccountBalance = async (web3, asset, account, callback) => {
  try {
    const erc20Contract = new web3.eth.Contract(
      asset.erc20ABI,
      asset.erc20address
    );

    const balanceOfAddress = await erc20Contract
      .methods
      .balanceOf(account)
      .call({ from: account });

    callback(null, parseFloat(balanceOfAddress) / 10 ** asset.decimals);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getVaultBalance = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const balanceOfVault = await vaultContract
      .methods
      .balanceOf(account)
      .call({ from: account });

    callback(null, parseFloat(balanceOfVault) / 10 ** asset.decimals);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getWholeVaultBalance = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const balanceOfVault = await vaultContract.methods.balance().call({
      from: account
    });

    callback(null, parseFloat(balanceOfVault) / 10 ** asset.decimals);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getStrategy = async (web3, asset, account, callback) => {
  try {
    const strategyContract = new web3.eth.Contract(
      asset.vaultStrategyABI,
      asset.vaultStrategyAddress
    );

    const strategyName = await strategyContract
      .methods
      .getNameStrategy()
      .call({ from: account });

    callback(null, strategyName);
  } catch (error) {
    console.error(error?.message);

    callback(null, '');
  }
};

const getAvailable = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const available = await vaultContract.methods.available().call({
      from: account
    });

    callback(null, parseFloat(available) / 10 ** asset.decimals);
  } catch(error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getVaultTotalSupply = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const totalSupply = await vaultContract.methods.totalSupply().call({
      from: account
    });

    callback(null, parseFloat(totalSupply) / 10 ** asset.decimals);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getVaultMin = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const min = await vaultContract.methods.min().call({ from: account });

    callback(null, min / 100);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getVaultMax = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const max = await vaultContract.methods.MAX().call({ from: account });

    callback(null, max / 100);
  } catch (error) {
    console.error(error?.message);

    callback(null, 0);
  }
};

const getVaultsDataByDate = (
  vaultAddress,
  apyAddress,
  fromDate,
  toDate,
  callback
) => {
  const vaultsInterface = `query Vault($address: String) {
    vaultHistories(
      first: 1,
      where: {
        address: $address,
        timestamp_gt: ${fromDate},
        timestamp_lt: ${toDate}
      }
    ) {
      id
      address
      block
      pricePerFullShare
      timestamp
    }
  }`;

  axios.post(
    apyAddress,
    {
      query: vaultsInterface,
      variables: { address: vaultAddress.toLowerCase() }
    }
  ).then(({ data }) => {
    callback(null, data?.data?.vaultHistories);
  }).catch((error) => {
    callback(error);
  });
};

const calculateAPY = (
  currentBlock,
  oneDayAgoBlock,
  previousBlock,
  previousValue,
  currentValue
) => {
  const nbrBlocksInDay = currentBlock - oneDayAgoBlock;
  const pricePerFullShareDelta = (currentValue - previousValue) / 1e18;
  const blockDelta = currentBlock - previousBlock;
  const dailyRoi = pricePerFullShareDelta / blockDelta * 100 * nbrBlocksInDay;
  const yearlyRoi = dailyRoi * 365;

  return yearlyRoi;
};

const parseAPYResult = (data, vaultAddress) => {
  const apyOneWeekSample = data[2][0]?.pricePerFullShare &&
    data[4][0]?.pricePerFullShare ?
    calculateAPY(
      data[4][0].block,
      data[1][0].block,
      data[2][0].block,
      data[2][0].pricePerFullShare,
      data[4][0].pricePerFullShare
    ) : 0;

  const apyOneMonthSample = data[3][0]?.pricePerFullShare &&
    data[4][0]?.pricePerFullShare ?
    calculateAPY(
      data[4][0].block,
      data[1][0].block,
      data[3][0].block,
      data[3][0].pricePerFullShare,
      data[4][0].pricePerFullShare
    ) : 0;

  const apyInceptionSample = data[0][0]?.pricePerFullShare &&
    data[4][0]?.pricePerFullShare ?
    calculateAPY(
      data[4][0].block,
      data[1][0].block,
      data[0][0].block,
      data[0][0].pricePerFullShare,
      data[4][0].pricePerFullShare
    ) : 0;

  return { apyOneWeekSample, apyOneMonthSample, apyInceptionSample };
};

const getAPY = async (web3, apyAddress, vaultAddress, callback) => {
  const STEP = 86400; // 24 hrs

  const currentBlock = await web3.eth.getBlockNumber();

  const inception = Math.round(moment().subtract(1, 'years').valueOf() / 1000);
  const oneDayAgo = Math.round(moment().subtract(1, 'days').valueOf() / 1000);
  const oneWeekAgo = Math.round(moment().subtract(1, 'weeks').valueOf() / 1000);
  const oneMonthAgo = Math.round(moment().subtract(1, 'months').valueOf() / 1000);

  async.parallel([
    (callback) => {
      getVaultsDataByDate(
        vaultAddress,
        apyAddress,
        inception,
        inception + STEP,
        callback
      );
    },
    (callback) => {
      getVaultsDataByDate(
        vaultAddress,
        apyAddress,
        oneDayAgo,
        oneDayAgo + STEP,
        callback
      );
    },
    (callback) => {
      getVaultsDataByDate(
        vaultAddress,
        apyAddress,
        oneWeekAgo,
        oneWeekAgo + STEP,
        callback
      );
    },
    (callback) => {
      getVaultsDataByDate(
        vaultAddress,
        apyAddress,
        oneMonthAgo,
        oneMonthAgo + STEP,
        callback
      );
    },
    (callback) => {
      getVaultsDataByDate(
        vaultAddress,
        apyAddress,
        oneDayAgo + (STEP / 2),
        oneDayAgo + STEP,
        callback
      );
    }
  ], (error, data) => {
    error && console.error(error?.message || error);

    if (!error && data) {
      callback(null, parseAPYResult(data, currentBlock));
    } else {
      callback(null, {
        apyOneWeekSample: 0,
        apyOneMonthSample: 0,
        apyInceptionSample: 0
      });
    }
  });
};

const getVaultAPY = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const pricePerFullShare = await vaultContract
      .methods
      .getPricePerFullShare()
      .call({ from: account });

    const block = await web3.eth.getBlockNumber();

    const diff = block - asset.lastMeasurement;

    if (diff === 0) {
      callback(null, { pricePerFullShare: 0, apy: 0 });
    } else {
      callback(null, {
        pricePerFullShare: parseFloat(pricePerFullShare) / 1e18,
        apy: parseFloat(
          (pricePerFullShare - asset.measurement) / 1e18 / diff * 242584600
        )
      });
    }
  } catch(error) {
    console.error(error?.message);

    callback(null, { pricePerFullShare: 0, apy: 0 });
  }
};

const getGovernance = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const governance = await vaultContract
      .methods
      .governance()
      .call({ from: account });

    callback(null, governance);
  } catch(error) {
    console.error(error?.message);

    callback(null, '');
  }
};

const getVaultPausedStatus = async (web3, asset, account, callback) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.vaultContractABI,
      asset.vaultContractAddress
    );

    const paused = await vaultContract
      .methods
      .paused()
      .call({ from: account });

    callback(null, paused);
  } catch(error) {
    console.error(error?.message);

    callback(null, '');
  }
};

const getVaultBalances = ({ web3, list, account }) => {
  return async (dispatch) => {
    web3 && list && account && dispatch({
      type: actionTypes.VAULTS_LOADING_UPDATE,
      payload: true
    });

    web3 && list && account && async.map(list, (asset, callback) => {
      getVaultDecimals(web3, asset, account).then((decimals) => {
        asset.decimals = decimals;

        async.parallel([
          (callbackInner) => {
            getAccountBalance(web3, asset, account, callbackInner);
          },
          (callbackInner) => {
            getVaultBalance(web3, asset, account, callbackInner);
          },
          (callbackInner) => {
            getWholeVaultBalance(web3, asset, account, callbackInner);
          },
          (callbackInner) => getStrategy(web3, asset, account, callbackInner),
          (callbackInner) => getAvailable(web3, asset, account, callbackInner),
          (callbackInner) => {
            getVaultTotalSupply(web3, asset, account, callbackInner);
          },
          (callbackInner) => getVaultMin(web3, asset, account, callbackInner),
          (callbackInner) => getVaultMax(web3, asset, account, callbackInner),
          (callbackInner) => {
            getAPY(
              web3,
              asset.apySubgraph,
              asset.vaultContractAddress,
              callbackInner
            );
          },
          (callbackInner) => getVaultAPY(web3, asset, account, callbackInner),
          (callbackInner) => getGovernance(web3, asset, account, callbackInner),
          (callbackInner) => {
            getVaultPausedStatus(web3, asset, account, callbackInner);
          }
        ], (error, data) => {
          if (error) {
            return callback(error);
          }

          asset.balance = data[0];
          asset.vaultBalance = data[1];
          asset.wholeVaultBalance = data[2];
          asset.strategyName = data[3];
          asset.available = data[4];
          asset.totalSupply = data[5];
          asset.min = data[6];
          asset.max = data[7];
          asset.stats = data[8];
          asset.pricePerFullShare = data[9].pricePerFullShare;
          asset.apy = data[9].apy;
          asset.governance = data[10];
          asset.paused = data[11];

          callback(null, asset);
        })
      }).catch((error) => callback(error));
    },
    (error, vaults) => {
      error && console.error(error?.message);

      !error && vaults && dispatch({
        type: actionTypes.VAULTS_LIST_UPDATE,
        payload: vaults
      });

      dispatch({ type: actionTypes.VAULTS_LOADING_UPDATE, payload: false });
    });
  };
};

export default getVaultBalances;
