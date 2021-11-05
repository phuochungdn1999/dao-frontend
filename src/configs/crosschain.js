import { default as crosschain56 } from './crosschain-56';
import { default as crosschain1 } from './crosschain-1';

const crosschain = process.env.REACT_APP_PROPOSAL_NETWORK === 'mainnet' ?
  [
    {
      id: 56,
      list: crosschain56
    },
    {
      id: 1,
      list: crosschain1
    }
  ] :
  [
    {
      id: 56,
      list: crosschain56
    },
    {
      id: 1,
      list: crosschain1
    }
  ];

export default crosschain;
