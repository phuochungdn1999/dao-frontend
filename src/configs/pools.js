import { default as pools1 } from './pools-1';
import { pools2 } from './pools-1';

const pools = process.env.REACT_APP_PROPOSAL_NETWORK === 'mainnet' ?
  [
    {
      id: 97,
      list: pools2
    }
  ] :
  [
    {
      id: 1,
      list: pools1
    },
    {
      id: 97,
      list: pools2
    }
  ];

export default pools;
