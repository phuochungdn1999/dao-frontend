import { ethers } from 'ethers';
import { isWalletConnectMethod, truncateWalletAddress } from '../../utils';
import { WalletActionTypes } from '../../enum/enums';
import { addBscNetworkToMetamask } from '../../helper/metamask.helper'; 

export let web3Provider;
export let signer;

// declare global {
//   interface Window {
//     ethereum: undefined | Record<string, any>;
//     BinanceChain: undefined | Record<string, any>;
//   }
// }

export const endWalletConnecting = () => ({
  type: WalletActionTypes.CONNECT_WALLET_PROCESS_END,
});


export const startWalletConnecting = () => ({
  type: WalletActionTypes.CONNECT_WALLET_PROCESS_START,
});


const connectWalletPending = (method) => ({
  type: WalletActionTypes.CONNECT_WALLET_PENDING,
  payload: method,
});


const connectWalletSuccess = (walletData)  => ({
  type: WalletActionTypes.CONNECT_WALLET_SUCCESS,
  payload: walletData,
});


const connectWalletFailure = (error) => ({
  type: WalletActionTypes.CONNECT_WALLET_FAILURE,
  payload: error,
});



export const resetWalletState = () => {
  localStorage.setItem('LAST_CONNECTED_WALLET', '');

  return {
    type: WalletActionTypes.RESET_WALLET_STATE,
  };
};

export const connectByWeb3Provider = async (
  provider,
) => {
  web3Provider = await new ethers.providers.Web3Provider(window.ethereum, 'any');

  signer = web3Provider.getSigner();
  return signer;
};

export const connectByEthereumProvider =
  (method) => async (dispatch) => {
    dispatch(connectWalletPending(method));
    try {
      if (window.ethereum) {
        await window.ethereum.enable();

        const onInvalidNetwork = () => {
          dispatch(connectWalletFailure('Invalid network'));
          addBscNetworkToMetamask();

        };

        window.ethereum.on('accountsChanged', async (accounts) => {
          const [address] = accounts;
          if (address) {
            connectByWeb3Provider(window.ethereum, method, dispatch, onInvalidNetwork);
          } else {
            dispatch(resetWalletState());
          }
        });

        window.ethereum.on('chainChanged', async () => {
          connectByWeb3Provider(window.ethereum, method, dispatch, onInvalidNetwork);
        });

        window.ethereum.on('disconnect', () => {
          dispatch(resetWalletState());
        });

        const walletData = await connectByWeb3Provider(
          window.ethereum,
          method,
          dispatch,
          onInvalidNetwork,
        );
        if (walletData?.address) {
          setTimeout(() => dispatch(endWalletConnecting()), 2000);
        } else {
          dispatch(endWalletConnecting());
        }
      } else {
        dispatch(connectWalletFailure('No provider was found'));
        dispatch(endWalletConnecting());
      }
    } catch {
      dispatch(connectWalletFailure('Connection to wallet failed'));
      dispatch(endWalletConnecting());
    }
  };

export const autoConnectEthereumProvider = () => async (dispatch) => {
  try {
    const connectMethod = localStorage.getItem('LAST_CONNECTED_WALLET') ?? '';

    if (isWalletConnectMethod(connectMethod)) {
      if (connectMethod === 'METAMASK' && window.ethereum) {
        const w3Provider = await new ethers.providers.Web3Provider(
          window.ethereum,
          'any',
        );

        const accounts = await w3Provider.listAccounts();
        if (accounts.length > 0) {
          dispatch(connectByEthereumProvider(connectMethod));
        }
      }
      
    }
  } catch (error) {
    console.error(error);
  }
};
