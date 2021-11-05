const initialSate = {
  status: false
};

export const actionTypes = {
  UPDATE_CONNECTION: 'UPDATE_CONNECTION'
};

const connection = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CONNECTION:
      return { status: action.payload };
    default:
      return state;
  }
};

export default connection;
