import { actionTypes } from '../reducers/vaults';

const setBasedOn = ({ value }) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.VAULTS_BASED_ON_UPDATE, payload: value });
  };
};

export default setBasedOn;
