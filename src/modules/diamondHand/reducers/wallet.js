import { WalletActionTypes } from "../../../enum/enums"; 

const initialState = {
  address: '',
  connectMethod: null,
  balance: 0,
  error: null,
  status: 'DISCONNECTED',
  isConnectProcessActive: false,
};

export const wallet = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case WalletActionTypes.CONNECT_WALLET_PROCESS_START:
      return { ...state, isConnectProcessActive: true };
    case WalletActionTypes.CONNECT_WALLET_PROCESS_END:
      return { ...state, isConnectProcessActive: false };
    case WalletActionTypes.CONNECT_WALLET_PENDING:
      return { ...state, connectMethod: action.payload, status: 'CONNECTING' };
    case WalletActionTypes.CONNECT_WALLET_SUCCESS:
      return { ...state, ...action.payload, status: 'CONNECTED' };
    case WalletActionTypes.CONNECT_WALLET_FAILURE:
      return {
        ...state,
        error: action.payload,
        status: 'DISCONNECTED',
        balance: 0,
        address: '',
      };
    case WalletActionTypes.RESET_WALLET_STATE:
      return initialState;
    default:
      return state;
  }
};
