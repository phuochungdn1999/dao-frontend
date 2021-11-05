import { actionTypes } from '../reducers/prices';

const getGasPrices = ({ web3 }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_LOADING, payload: true });

    try {
      await web3?.eth.getGasPrice((error, result) => {
        error && console.log(error?.message);

        dispatch({ type: actionTypes.UPDATE_GAS, payload: result }); // gwei
      });
    } catch (error) {
      console.error(error?.message);

      dispatch({ type: actionTypes.UPDATE_GAS, payload: null });
    } finally {
      dispatch({ type: actionTypes.UPDATE_LOADING, payload: false });
    }
  };
};

export default getGasPrices;
