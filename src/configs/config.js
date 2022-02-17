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
    ? '0x7D5aBeb80CE5Eb424Cb9DC64082aa21CE3fc9417'
    : '0x6C721B9fe3663dD29d35224259878812B8eC2406',
  NETWORK_ID: dev() ? 97 : 56,
  YFIAG_ADDRESS: dev()
    ? '0x71f4A5202A09DA255558F3Fb6D05C8FD24d10a2e'
    : '0x1F64703ae00C06420dd21fE75E9Ef6E008212263',
  YFIAG_DECIMALS: dev() ? 18 : 18,
  MULTICALL_ADDRESS: dev()
    ? '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576'
    : '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  ETH_PROVIDER: dev()
    ? 'https://rinkeby.infura.io/v3/f7b6615c064a4003aad244f4ee088191'
    : 'https://mainnet.infura.io/v3/f7b6615c064a4003aad244f4ee088191',
  ETC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  BSC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  // BSC_PROVIDER: 'http://127.0.0.1:8556',
};