const initialSate = {
  provider: null,
  instance: null,
  chain: null
};

export const actionTypes = {
  UPDATE_PROVIDER: 'UPDATE_PROVIDER',
  UPDATE_INSTANCE: 'UPDATE_INSTANCE',
  UPDATE_CHAIN: 'UPDATE_CHAIN'
};

const web3context = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_PROVIDER:
      return { ...state, provider: action.payload };
    case actionTypes.UPDATE_INSTANCE:
      return { ...state, instance: action.payload };
    case actionTypes.UPDATE_INSTANCE_EHEREUM:
      return { ...state, instance_ethereum: action.payload};
    case actionTypes.UPDATE_CHAIN:
      return { ...state, chain: action.payload };
    default:
      return state;
  }
};

export default web3context;
