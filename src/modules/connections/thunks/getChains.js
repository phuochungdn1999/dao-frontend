import axios from 'axios';

import { actionTypes } from '../reducers/chains';

const getChains = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.CHAINS_LOADING_UPDATE, payload: true });

    axios.get('https://chainid.network/chains.json')
      .then(({ data }) => {
        dispatch({ type: actionTypes.CHAINS_LIST_UPDATE, payload: data });
        dispatch({ type: actionTypes.CHAINS_LOADING_UPDATE, payload: false });
      })
      .catch((error) => {
        dispatch({ type: actionTypes.CHAINS_LOADING_UPDATE, payload: false });

        console.error(error?.message || error);
      });
  };
};

export default getChains;
