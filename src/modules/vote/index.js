import { default as Vote } from './pages/Vote';

// components:
export { default as VoteActions } from './components/VoteActions';
export { default as VoteHeader } from './components/VoteHeader';
export { default as VoteCreate } from './components/VoteCreate';
export { default as VoteStats } from './components/VoteStats';
export { default as VoteInfo } from './components/VoteInfo';
export { default as VoteTabs } from './components/VoteTabs';

// pages:
export const pages = [
  {
    path: '/vote',
    icon: 'vote',
    order: 4,
    title: 'VOTE_TITLE',
    visible: true,
    component: Vote
  }
];

// reducers:
export { default as proposals } from './reducers/proposals';

// thunks:
export {
  default as getCreateProposeRequirements
} from './thunks/getCreateProposeRequirements';
export { default as revokeProposal } from './thunks/revokeProposal';
export { default as createPropose } from './thunks/createPropose';
export { default as getProposals } from './thunks/getProposals';
export { default as setTabValue } from './thunks/setTabValue';
export { default as voteAgainst } from './thunks/voteAgainst';
export { default as voteFor } from './thunks/voteFor';
