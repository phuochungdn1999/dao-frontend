const initialSate = {
  loading: false,
  address: null
};

export const actionTypes = {
  UPDATE_ACCOUNT_LOADING: 'UPDATE_ACCOUNT_LOADING',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS'
};

const account = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACCOUNT_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.UPDATE_ADDRESS:
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

export default account;
