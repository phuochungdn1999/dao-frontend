import { default as crosschain56 } from './crosschain-56';
import { default as crosschain1 } from './crosschain-1';
import { default as crosschain97 } from './crosschain-97';
import { default as crosschain4 } from './crosschain-4';
import { default as crosschain80001 } from './crosschain-80001';

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
    },
    {
      id: 97,
      list: crosschain97
    },
    {
      id: 4,
      list: crosschain4
    },
    {
      id: 80001,
      list: crosschain80001
    }
  ];

export default crosschain;
