const initialSate = {
  loading: false,
  chain: null
};

export const actionTypes = {
  CROSSCHAIN_LOADING_UPDATE: 'CROSSCHAIN_LOADING_UPDATE',
  CROSSCHAIN_CHAIN_UPDATE: 'CROSSCHAIN_CHAIN_UPDATE'
};

const crosschain = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.CROSSCHAIN_LOADING_UPDATE:
      return { ...state, loading: action.payload };
    case actionTypes.CROSSCHAIN_CHAIN_UPDATE:
      return { ...state, chain: action.payload };
    default:
      return state;
  }
};

export default crosschain;
