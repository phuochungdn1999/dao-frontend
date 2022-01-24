import {
    vaultControlerABI,
    vaultStrategyABI,
    vaultERC20ABI,
    vaultABI
  } from '../contracts/';
  
  const vaults = [
    {
      id: 'ibWBNB Strategy',
      name: 'ibWBNB Strategy',
      symbol: 'ibWBNB',
      description: 'ibWBNB - Alpaca',
      vaultSymbol: 'ibWBNB',
      erc20address: '0xf9d32C5E10Dd51511894b360e6bD39D7573450F9',
      vaultContractAddress: '0x9Fcf146eAF396FF436aD11c9eC740629bEd2e5cb',
      vaultStrategyAddress: '0x49a1dFFe954629Ee0b8c1CAB3EF5dC1C28a08BD2',
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
    },
    {
        id: 'Cake Strategy',
        name: 'Cake Strategy',
        symbol: 'Cake',
        description: 'Cake - Cake',
        vaultSymbol: 'Cake',
        erc20address: '0x7aBcA3B5f0Ca1da0eC05631d5788907D030D0a22',
        vaultContractAddress: '0x5B83dD98DF6501627Be95E7F9966E798B7C7943D',
        vaultStrategyAddress: '0x849F551Fca9FBf588d6A253D703A0d7cc483280A',
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
  