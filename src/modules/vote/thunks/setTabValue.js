import { actionTypes } from '../reducers/proposals';

const setTabValue = ({ value }) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.PROPOSALS_TAB_UPDATE, payload: value });
  };
};

export default setTabValue;
