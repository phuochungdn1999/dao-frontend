const initialSate = {
  hideZero: false,
  loading: false,
  basedOn: null,
  search: '',
  list: null
};

export const actionTypes = {
  VAULTS_HIDE_ZERO_UPDATE: 'VAULTS_HIDE_ZERO_UPDATE',
  VAULTS_BASED_ON_UPDATE: 'VAULTS_BASED_ON_UPDATE',
  VAULTS_LOADING_UPDATE: 'VAULTS_LOADING_UPDATE',
  VAULTS_SEARCH_UPDATE: 'VAULTS_SEARCH_UPDATE',
  VAULTS_LIST_UPDATE: 'VAULTS_LIST_UPDATE'
};

const vaults = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.VAULTS_HIDE_ZERO_UPDATE:
      return { ...state, hideZero: action.payload };
    case actionTypes.VAULTS_BASED_ON_UPDATE:
      return { ...state, basedOn: action.payload };
    case actionTypes.VAULTS_LOADING_UPDATE:
      return { ...state, loading: action.payload };
    case actionTypes.VAULTS_SEARCH_UPDATE:
      return { ...state, search: action.payload };
    case actionTypes.VAULTS_LIST_UPDATE:
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

export default vaults;
