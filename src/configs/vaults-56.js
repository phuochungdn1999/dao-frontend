import {
  vaultControlerABI,
  vaultStrategyABI,
  vaultERC20ABI,
  vaultABI
} from '../contracts/';

const vaults = [
  {
    id: 'VenusStrategy',
    name: 'VenusStrategy',
    symbol: 'BTCB',
    description: 'BTCB - vBTC',
    vaultSymbol: 'Venus',
    erc20address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    vaultContractAddress: '0xbF8F52485f4416572F1bfEcFbd8dffBAcE0F2A80',
    vaultStrategyAddress: '0x5492Aa700E94E99Dd19389eE773c0230B8b69139',
    erc20ABI: vaultERC20ABI,
    vaultContractABI: vaultABI,
    vaultStrategyABI: vaultStrategyABI,
    apySubgraph: 'https://api.thegraph.com/subgraphs/name/ulmmrt/yearnagnostic-subgraph',
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
