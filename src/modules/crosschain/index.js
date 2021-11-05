import { default as CrossChain } from './pages/CrossChain';

// components:
export { default as CrossChainDescription } from './components/CrossChainDescription';
export { default as CrossChainFormHeader } from './components/CrossChainFormHeader';
export { default as CrossChainFormFields } from './components/CrossChainFormFields';

// pages:
export const pages = [
  {
    path: '/crosschain',
    icon: 'crosschain',
    order: 5,
    title: 'CROSS_CHAIN_TITLE',
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
