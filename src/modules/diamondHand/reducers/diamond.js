import moment from 'moment';
import { DiamondHandActionTypes } from '../../../enum/enums';

const initialState = {
  data: {
    token: '',
    diamondBalance: 0,
    totalAmount: 0,
    totalEarned: 0,
    lockedAmount: 0,
    unlockedAmount: 0,
    monthPlan3: 10,
    monthPlan6: 30,
    monthPlan12: 90,
    globalTotalReward: 123456,
    currentList: [
      {
        id: '0',
        amount: 0,
        plan: '03 Month',
        dueDate: moment().toDate(),
        total: 0,
      },
      {
        id: '1',
        amount: 900,
        plan: '06 Month',
        dueDate: moment().toDate(),
        total: 14900,
      },
      {
        id: '2',
        amount: 800,
        plan: '12 Month',
        dueDate: moment().toDate(),
        total: 13800,
      },
      {
        id: '004',
        amount: 700,
        plan: '03 Month',
        dueDate: moment().toDate(),
        total: 12700,
      },
    ],
  },
  filter: {
    count: 0,
    limit: 5,
    skip: 0,
    page: 1,
  },
};

const diamond = (
  state = initialState,
  action,
) => {
  const { payload } = action;

  switch (action.type) {
    case DiamondHandActionTypes.SET_DIAMOND_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    case DiamondHandActionTypes.SET_DIAMOND_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...payload,
        },
      };
    case DiamondHandActionTypes.SET_DIAMOND_LIST:
      return {
        ...state,
        data: {
          ...state.data,
          currentList: [...payload],
        },
      };
    default:
      return state;
  }
};

export default diamond;