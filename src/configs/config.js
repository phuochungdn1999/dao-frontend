import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const dev = () => {
  if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development') {
    return true;
  }
  return false;
};

export const config = {
  DIAMOND_HAND: dev()
    ? '0xFfCA7feaAd922c8bB31eC711b52338dfD4b6Fd1F'
    : '0x0bFbF11D65d170bC8f02b83acc8762206B00A5e3',
  NETWORK_ID: dev() ? 97 : 97, //TODO: change back to 56
  YFIAG_ADDRESS: dev()
    ? '0x71f4A5202A09DA255558F3Fb6D05C8FD24d10a2e'
    : '0x4A2C8B1F6c401626E2293005B667fA1Cf2da374C',
  YFIAG_DECIMALS: dev() ? 18 : 18,
  MULTICALL_ADDRESS: dev()
    ? '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576'
    : '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  ETH_PROVIDER: dev()
    ? 'https://rinkeby.infura.io/v3/f7b6615c064a4003aad244f4ee088191'
    : 'https://mainnet.infura.io/v3/f7b6615c064a4003aad244f4ee088191',
  ETC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  BSC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
};