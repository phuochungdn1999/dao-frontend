import { default as Stake } from './pages/Stake';

// components:
export { default as StakeContent } from './components/StakeContent';
export { default as StakeHeader } from './components/StakeHeader';
export { default as StakeInfo } from './components/StakeInfo';

// pages:
export const pages = [
  {
    path: '/stake',
    icon: 'stake',
    order: 3,
    title: 'STAKE_TITLE',
    visible: true,
    component: Stake,
  }
];

// reducers:
export { default as pools } from './reducers/pools';

// thunks:
export { default as getVoteRequirements } from './thunks/getVoteRequirements';
export { default as getPoolsBalances } from './thunks/getPoolsBalances';
export { default as unstakePool } from './thunks/unstakePool';
export { default as stakePool } from './thunks/stakePool';
export { default as claimPool } from './thunks/claimPool';
export { default as exitPool } from './thunks/exitPool';
