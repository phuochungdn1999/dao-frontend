const initialSate = {
  loading: false,
  list: null
};

export const actionTypes = {
  UPDATE_POOLS_LOADING: 'UPDATE_POOLS_LOADING',
  UPDATE_POOLS_LIST: 'UPDATE_POOLS_LIST'
};

const pools = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_POOLS_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.UPDATE_POOLS_LIST:
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

export default pools;
