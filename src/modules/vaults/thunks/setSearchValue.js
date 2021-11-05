import { actionTypes } from '../reducers/vaults';

const setSearchValue = ({ value }) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.VAULTS_SEARCH_UPDATE, payload: value });
  };
};

export default setSearchValue;
