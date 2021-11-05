import CoinGecko from 'coingecko-api';

import { actionTypes } from '../reducers/prices';

const CoinGeckoClient = new CoinGecko();

const getUSDPrices = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_LOADING, payload: true });

    try {
      const { data } = await CoinGeckoClient.simple.price({
        vs_currencies: ['usd', 'eth'],
        ids: [
          'dai',
          'nusd',
          'tether',
          'usd-coin',
          'true-usd',
          'ethereum',
          'chainlink',
          'chainlink',
          'aave-link',
          'lp-bcurve',
          'binance-usd',
          'yearn-finance',
          'lp-sbtc-curve',
          'gemini-dollar',
          'lp-3pool-curve',
          'wrapped-bitcoin',
          'curve-dao-token',
          'curve-fi-ydai-yusdc-yusdt-ytusd'
        ],
      });

      dispatch({ type: actionTypes.UPDATE_USD, payload: data });

      dispatch({ type: actionTypes.UPDATE_LOADING, payload: false });
    } catch(error) {
      console.error(error?.message);

      dispatch({ type: actionTypes.UPDATE_USD, payload: null });

      dispatch({ type: actionTypes.UPDATE_LOADING, payload: false });
    }
  };
};

export default getUSDPrices;
