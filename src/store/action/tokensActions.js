import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import ERC20Abi from '../../abi/erc20.abi';
import { config } from '../../configs/config';
import { jsonRpcProvider } from '../../api/contract.service';
import { axiosApi } from '../../utils/axiosApi';
import { TokensActionTypes } from '../../enum/enums';

const FetchTokensPendingActionType = {
  type: TokensActionTypes.FETCH_TOKENS_PENDING
};

const fetchTokensPending = () => ({
  type: TokensActionTypes.FETCH_TOKENS_PENDING,
});

const FetchTokensSuccessActionType = {
  type: TokensActionTypes.FETCH_TOKENS_SUCCESS,
};

const fetchTokensSuccess = (tokensList) => ({
  type: TokensActionTypes.FETCH_TOKENS_SUCCESS,
  payload: tokensList,
});

const FetchTokensFailureActionType = {
  type: TokensActionTypes.FETCH_TOKENS_FAILURE
};

const fetchTokensFailure = () => ({
  type: TokensActionTypes.FETCH_TOKENS_FAILURE,
});

const UpdateListTokenActionType = {
  type: TokensActionTypes.UPDATE_LIST_TOKEN,
};

const updateListToken = (tokensList) => ({
  type: TokensActionTypes.UPDATE_LIST_TOKEN,
  payload: tokensList,
});

const BNB = {
  address: config.WRAPPED_TOKEN,
  decimals: 18,
  icon: null,
  id: 0,
  name: 'BNB',
  symbol: 'BNB',
  liquidity: '',
  usdRate: '0',
  volumetoken_1d: '0',
  volumetoken_7d: '0',
  volumetokenusd_1d: '0',
  volumetokenusd_7d: '0',
};

export const fetchTokens = () => async (dispatch) => {
  dispatch(fetchTokensPending());
  try {
    const response = await axiosApi.get('/tokens');

    const wbnb = response.data.tokens.find(
      (t) => t.address.toLowerCase() === config.WRAPPED_TOKEN.toLowerCase(),
    );

    let tempBNB = BNB;

    if (wbnb) {
      tempBNB = {
        ...wbnb,
        ...{ name: 'BNB', symbol: 'BNB', icon: null, usdRate: wbnb.usdRate ?? '0' },
      };
    }

    dispatch(fetchTokensSuccess([tempBNB, ...response.data.tokens]));
  } catch (e) {
    dispatch(fetchTokensFailure());
  }
};

const AddCustomTokenActionType = {
  type: TokensActionTypes.ADD_CUSTOM_TOKEN,
};

const addCustomToken = (token) => ({
  type: TokensActionTypes.ADD_CUSTOM_TOKEN,
  payload: token,
});

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const updateTokensBalance = () => async (dispatch, getState) => {
  try {
    await timeout(5000);
    const tokensListWithBalances = [];
    const {
      tokens: { list },
      wallet,
    } = getState();

    const tokenAddresses = list.slice(0, list.length).map((el) => el.address);

    const contracts = await Promise.all(
      tokenAddresses.map((address) => new ethers.Contract(address, ERC20Abi, jsonRpcProvider)),
    );

    const BNBBalance = await jsonRpcProvider.getBalance(wallet.address);

    const balances = await Promise.all(contracts.map((c) => c.functions.balanceOf(wallet.address)));

    for (let i = 0; i < list.length; i++) {
      if (i === 0) {
        // BNB
        tokensListWithBalances.push({
          ...list[i],
          balance: new BigNumber(BNBBalance.toString()).dividedBy(Math.pow(10, 18)).toJSON(),
        });
      } else {
        tokensListWithBalances.push({
          ...list[i],
          balance: new BigNumber(balances[i][0].toString())
            .dividedBy(Math.pow(10, list[i].decimals))
            .toJSON(),
        });
      }
    }

    dispatch(updateListToken(tokensListWithBalances));
  } catch (e) {
    console.error(e);
  }
};

export const resetTokensBalance = () => (dispatch, getState) => {
  const {
    tokens: { list },
  } = getState();

  dispatch(updateListToken(list.map((token) => ({ ...token, balance: undefined }))));
};
