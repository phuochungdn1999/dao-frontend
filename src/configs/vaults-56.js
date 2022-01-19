import {
  vaultControlerABI,
  vaultStrategyABI,
  vaultERC20ABI,
  vaultABI
} from '../contracts/';

const vaults = [
  {
    id: 'Venus Strategy',
    name: 'Venus Strategy',
    symbol: 'BTCB',
    description: 'BTCB - vBTC',
    vaultSymbol: 'Venus',
    erc20address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    vaultContractAddress: '0x372eFde3838fbBe12e051b45a2d7763Eb9883553',
    vaultStrategyAddress: '0xF5Ab028FCd0A1Bc7930b984DBbe12f3841046f4f',
    erc20ABI: vaultERC20ABI,
    vaultContractABI: vaultABI,
    vaultStrategyABI: vaultStrategyABI,
    apySubgraph: 'https://api.thegraph.com/subgraphs/name/transonhy96/ffiagbridgebsc',
    balance: 0,
    vaultBalance: 0,
    decimals: 18,
    deposit: true,
    depositAll: true,
    withdraw: true,
    withdrawAll: true,
    lastMeasurement: 11210773,
    measurement: 1e18,
    depositDisabled: false,
    price_id: 'dai'
  }
];

export default vaults;
