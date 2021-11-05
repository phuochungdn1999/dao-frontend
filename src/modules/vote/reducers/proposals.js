const initialSate = {
  loading: false,
  list: null,
  tab: null
};

export const actionTypes = {
  PROPOSALS_LOADING_UPDATE: 'PROPOSALS_LOADING_UPDATE',
  PROPOSALS_LIST_UPDATE: 'PROPOSALS_LIST_UPDATE',
  PROPOSALS_TAB_UPDATE: 'PROPOSALS_TAB_UPDATE'
};

const proposals = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.PROPOSALS_LOADING_UPDATE:
      return { ...state, loading: action.payload };
    case actionTypes.PROPOSALS_LIST_UPDATE:
      return { ...state, list: action.payload };
    case actionTypes.PROPOSALS_TAB_UPDATE:
      return { ...state, tab: action.payload };
    default:
      return state;
  }
};

export default proposals;
