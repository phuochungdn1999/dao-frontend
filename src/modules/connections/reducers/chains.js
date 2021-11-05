const initialSate = {
  loading: false,
  list: null
};

export const actionTypes = {
  CHAINS_LOADING_UPDATE: 'CHAINS_LOADING_UPDATE',
  CHAINS_LIST_UPDATE: 'CHAINS_LIST_UPDATE'
};

const chains = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.CHAINS_LOADING_UPDATE:
      return { ...state, loading: action.payload };
    case actionTypes.CHAINS_LIST_UPDATE:
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

export default chains;
