import { default as vaults56 } from './vaults-56';
import { default as vaults1 } from './vaults-1';
import { default as vaults97 } from './vaults-97';
import { default as vaults31340 } from './vaults-31340';
import { default as vaults31338 } from './vaults-31338';


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
    },
    {
      id: 31340,
      list: vaults31340
    },
    {
      id: 31338,
      list: vaults31338
    }
  ];

export default vaults;
