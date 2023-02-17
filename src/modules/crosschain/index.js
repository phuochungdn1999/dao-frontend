import { default as CrossChain } from './pages/CrossChain';

// components:
export { default as CrossChainDescription } from './components/CrossChainDescription';
export { default as CrossChainFormHeader } from './components/CrossChainFormHeader';
export { default as CrossChainFormFields } from './components/CrossChainFormFields';
export { default as CrossChainFormFields1 } from './components/CrossChainFormFields2';


// pages:
export const pages = [
  {
    path: '/dao',
    icon: 'dao',
    order: 6,
    title: 'DAO',
    visible: true,
    component: CrossChain
  }
];

// reducers:
export { default as crosschain } from './reducers/crosschain';

// thunks:
export { default as getCrossChainBalances } from './thunks/getCrossChainBalances';
export { default as checkTransaction } from './thunks/checkTransaction';
export { default as sendTokens } from './thunks/sendTokens';
