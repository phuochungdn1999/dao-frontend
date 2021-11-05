import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { web3context, connection, chains } from '../modules/connections';
import { crosschain } from '../modules/crosschain';
import { proposals } from '../modules/vote';
import { account } from '../modules/account';
import { prices } from '../modules/dashboard';
import { vaults } from '../modules/vaults';
import { pools } from '../modules/stake';

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
    pools,
  }),
  applyMiddleware(thunk)
);

export default store;
