import { daoTokenYFIAGABI, daoGovernanceABI, daoERC20ABI } from '../contracts/';

const pools = [
  {
    id: 'yfiag',
    name: 'YFIAG',
    website: 'yearnagnostic.finance',
    link: 'https://yearnagnostic.finance/',
    tokens: [
      {
        id: 'yfiag',
        governanceAddress: '0x49e0F6089a437c14dF5DFC2f03366C9DF898046a',
        feeTokenAddress: '0xd40adff097e3cde2b96d81a4727f3e47093f3405',
        rewardsAddress: '0xd40adff097e3cde2b96d81a4727f3e47093f3405',
        tokenAddress: '0xd40adff097e3cde2b96d81a4727f3e47093f3405',
        governanceABI: daoGovernanceABI,
        feeTokenABI: daoERC20ABI,
        rewardsABI: daoERC20ABI,
        tokenABI: daoTokenYFIAGABI,
        apiHost: 'https://api.thegraph.com/subgraphs/name/ulmmrt/yearnagnostic-subgraph-mainnet',
        rewardsSymbol: 'YFIAG',
        symbol: 'YFIAG',
        decimals: 18,
        rewardsAvailable: 0,
        stakedBalance: 0,
        balance: 0
      }
    ]
  }
];

export default pools;

export const pools2 = [
  {
    id: 'yfiag',
    name: 'YFIAG',
    website: 'yearnagnostic.finance',
    link: 'https://yearnagnostic.finance/',
    tokens: [
      {
        id: 'yfiag',
        governanceAddress: '0x29E34e7D5034Eb2c204dcb92B53d16149411406F',
        feeTokenAddress: '0x29E34e7D5034Eb2c204dcb92B53d16149411406F',
        rewardsAddress: '0x29E34e7D5034Eb2c204dcb92B53d16149411406F',
        tokenAddress: '0x29E34e7D5034Eb2c204dcb92B53d16149411406F',
        governanceABI: daoGovernanceABI,
        feeTokenABI: daoERC20ABI,
        rewardsABI: daoERC20ABI,
        tokenABI: daoTokenYFIAGABI,
        apiHost: 'https://api.thegraph.com/subgraphs/name/ulmmrt/yearnagnostic-subgraph-mainnet',
        rewardsSymbol: 'YFIAG',
        symbol: 'YFIAG',
        decimals: 18,
        rewardsAvailable: 0,
        stakedBalance: 0,
        balance: 0
      }
    ]
  }
];
