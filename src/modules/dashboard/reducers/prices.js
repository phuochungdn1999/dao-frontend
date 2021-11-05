const initialSate = {
  loading: false,
  usd: null,
  gas: null
};

export const actionTypes = {
  UPDATE_LOADING: 'UPDATE_LOADING',
  UPDATE_USD: 'UPDATE_USD',
  UPDATE_GAS: 'UPDATE_GAS'
};

const prices = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.UPDATE_USD:
      return { ...state, usd: action.payload };
    case actionTypes.UPDATE_GAS:
      return { ...state, gas: action.payload };
    default:
      return state;
  }
};

export default prices;
