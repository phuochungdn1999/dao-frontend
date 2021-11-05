import web3 from 'web3';

import { actionTypes } from '../reducers/web3context';

const getWeb3Instacne = (provider) => {
  return (dispatch) => {
    if (provider) {
      dispatch({
        type: actionTypes.UPDATE_INSTANCE,
        payload: new web3(provider)
      });
    } else {
      dispatch({ type: actionTypes.UPDATE_INSTANCE, payload: null });
    }
  };
};

export default getWeb3Instacne;
