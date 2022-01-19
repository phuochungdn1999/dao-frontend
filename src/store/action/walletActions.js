import { Dispatch } from 'redux';
import { ethers } from 'ethers';
import { config } from '../../configs/config';
import { alertActions } from '../../store';
import { isWalletConnectMethod, truncateWalletAddress } from '../../utils';
import { WalletActionTypes } from '../../enum/enums';
import { addBscNetworkToMetamask } from '../../helper/metamask.helper'; 
import { updateBridgeInfo } from './bridgeActions';

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

          dispatch(
            alertActions.warning({
              heading: 'Woops... Invalid network.',
              message: 'Please set up Binance Smart Chain network.',
            }),
          );
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
          dispatch(
            alertActions.success({
              heading: 'Your wallet is ready to use!',
              message: `Wallet ${truncateWalletAddress(
                walletData.address,
              )} has been successfully installed with ${
                method === 'METAMASK'
                  ? 'Metamask'
                  : method === 'TRUST_WALLET'
                  ? 'TrustWallet'
                  : 'TokenPocket'
              }.`,
            }),
          );
          setTimeout(() => dispatch(endWalletConnecting()), 2000);
        } else {
          dispatch(endWalletConnecting());
        }
      } else {
        dispatch(connectWalletFailure('No provider was found'));
        dispatch(
          alertActions.warning({
            heading: 'Woops... we cannot add your wallet.',
            message: 'No provider was found.',
          }),
        );
        dispatch(endWalletConnecting());
      }
    } catch {
      dispatch(connectWalletFailure('Connection to wallet failed'));
      dispatch(
        alertActions.warning({
          heading: 'Woops... we cannot add your wallet.',
          message: 'Please try again.',
        }),
      );
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
