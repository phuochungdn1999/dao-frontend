import { actionTypes } from '../reducers/vaults';

const setHideZeroValue = ({ value }) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.VAULTS_HIDE_ZERO_UPDATE, payload: value });
  };
};

export default setHideZeroValue;
