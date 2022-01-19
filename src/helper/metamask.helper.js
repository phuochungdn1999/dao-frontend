import BigNumber from 'bignumber.js';
import { config, dev } from '../configs/config';

export const addBscNetworkToMetamask = async () => {
  try {
    if (window.ethereum) {
      if (dev()) {
        return await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'Binance Testnet',
              nativeCurrency: {
                name: 'Binance Coin',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-2-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com'],
            },
          ],
        });
      } else {
        return await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Binance Smart Chain',
              nativeCurrency: {
                name: 'Binance Coin',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed3.defibit.io/'],
              blockExplorerUrls: ['https://bscscan.com'],
            },
          ],
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const addEthNetworkToMetamask = async () => {
  try {
    if (window.ethereum) {
      let cf = dev() ? {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x4',
            chainName: 'Rinkeby Testnet',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [config.ETH_PROVIDER],
            blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
          },
        ],
      } : {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x1',
            chainName: 'Ethereum',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [config.ETH_PROVIDER],
            blockExplorerUrls: ['https://etherscan.io/'],
          },
        ],
      };
      let cfsw = dev() ? {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      } : {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      };
      try {
        return await window.ethereum.request(cfsw);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            return await window.ethereum.request(cf);
          } catch (addError) {
           
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const addEtcNetworkToMetamask = async () => {

  try {
    if (window.ethereum) {
      let cf = dev() ? {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x6',
            chainName: 'Ethereum Classic Testnet Kotti',
            nativeCurrency: {
              name: 'Ethereum Classic',
              symbol: 'ETC',
              decimals: 18,
            },
            rpcUrls: [config.ETC_PROVIDER],
            blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
          },
        ],
      } : {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x3D',
            chainName: 'Ethereum Classic Mainnet',
            nativeCurrency: {
              name: 'Ethereum Classic',
              symbol: 'ETC',
              decimals: 18,
            },
            rpcUrls: [config.ETC_PROVIDER],
            blockExplorerUrls: ['https://etherscan.io/'],
          },
        ],
      };
      let cfsw = dev() ? {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x6' }],
      } : {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3D' }],
      };
      try {
        return await window.ethereum.request(cfsw);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            return await window.ethereum.request(cf);
          } catch (addError) {
           
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const hasMetamaskSetBscNetwork = () => {
  if (window.ethereum) {
    if (dev()) {
      return new BigNumber(window.ethereum.chainId).toNumber() === 97;
    } else {
      return new BigNumber(window.ethereum.chainId).toNumber() === 56;
    }
  }
  return false;
};
