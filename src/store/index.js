import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { web3context, connection, chains } from '../modules/connections';
import { crosschain } from '../modules/crosschain';
import { proposals } from '../modules/vote';
import { account } from '../modules/account';
import { prices } from '../modules/dashboard';
import { vaults } from '../modules/vaults';
import { pools } from '../modules/stake';
import { diamond } from '../modules/diamondHand'
import { wallet } from '../modules/diamondHand/reducers/wallet';
import { theme } from '../modules/layout/reducers/layout';

const store = createStore(
  combineReducers({
    web3context,
    connection,
    crosschain,
    proposals,
    account,
    chains,
    prices,
    vaults,
    pools: pools,
    wallet,
    diamond,
    theme,
  }),
  applyMiddleware(thunk)
);

export * as tokensActions from './action/tokensActions';
export * as alertActions from './action/alertActions'
export default store;