import { default as vaults56 } from './vaults-56';
import { default as vaults1 } from './vaults-1';

const vaults = process.env.REACT_APP_PROPOSAL_NETWORK === 'mainnet' ?
  [
    {
      id: 56,
      list: vaults56
    },
    {
      id: 1,
      list: vaults1
    }
  ] :
  [
    {
      id: 56,
      list: vaults56
    },
    {
      id: 1,
      list: vaults1
    }
  ];

export default vaults;
