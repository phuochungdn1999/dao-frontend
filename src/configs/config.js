import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BSC_BLOCK_TIME = 3;

export const dev = () => {
  if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development') {
    return true;
  }
  return false;
};

export const config = {
  ROUTER_CONTRACT_ADDRESS: dev()
    ? '0xc93d26f4Ed2bE75A06d7D3F86850c46a63fb1CDf'
    : '0x647b09b532cef52f3b9b0b5bd05e843abd99b773',
  FACTORY_CONTRACT_ADDRESS: dev()
    ? '0xDfe15a4eAd864C4860b648a3d24D04a9BD24d3d1'
    : '0xc305f6f3e269a6bc828857e3ca69673731801cec',
  DIAMOND_HAND: dev()
    ? '0x0bFbF11D65d170bC8f02b83acc8762206B00A5e3'
    : '0x2Fd6ed8B7A581B23582eb91ed9238Dd5A681A4f0',
  NETWORK_ID: dev() ? 97 : 56,
  YFIAG_ADDRESS: dev()
    ? '0x4A2C8B1F6c401626E2293005B667fA1Cf2da374C'
    : '0x916792fd41855914ba4b71285c8a05b866f0618b',
  YFIAG_DECIMALS: dev() ? 18 : 18,
  AVERAGE_BLOCK_TIME_IN_SEC: 3,
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss Z',
  TIME_FORMAT: 'HH:mm:ss',
  MULTICALL_ADDRESS: dev()
    ? '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576'
    : '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  ETH_PROVIDER: dev()
    ? 'https://rinkeby.infura.io/v3/f7b6615c064a4003aad244f4ee088191'
    : 'https://mainnet.infura.io/v3/f7b6615c064a4003aad244f4ee088191',
  ETC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  BSC_PROVIDER: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
};

export const PAYB_PER_BLOCK = new BigNumber(4);
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365); // 10512000
export const BLOCKS_PER_WEEK = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 7); //
export const BLOCKS_PER_DAY = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24); //
export const PAYB_PER_YEAR = PAYB_PER_BLOCK.times(BLOCKS_PER_YEAR);

export const SPECIAL_ADDRESS = {
  LOCKED_YFIAG_ADDRESS: '0x0c89c0407775dd89b12918b9c0aa42bf96518820',
  STAKED_YFIAG_ADDRESS: '0x7536592bb74b5d62eb82e8b93b17eed4eed9a85c',
  BURNED_ADDRESS: '0x000000000000000000000000000000000000dead',
  PAYB_CONTRACT_ADDRESS: '0x916792fd41855914ba4b71285c8a05b866f0618b',
};

export const BSC_SCAN_API_KEY = 'DSST2Y17GIIXDWH8BSI13YBSSFEJXE9AFH'; // BSC Scan Registered to baoanhnguyen.0107@gmail.com
export const CMC_API_KEY = '4f25130a-5b77-456f-8112-14c6f4296e0a'; // CoinMarketCap - Registered to baoanhnguyen.0107@gmail.com
