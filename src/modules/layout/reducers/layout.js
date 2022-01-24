const initialSate = {
  isDarkmode: true,
};

export const actionTypes = {
  CHANGE_THEME_MODE: 'CHANGE_THEME_MODE',
};

export const theme = (state = initialSate, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME_MODE:
      return { ...state, isDarkmode: action.payload };
    default:
      return state;
  }
};

