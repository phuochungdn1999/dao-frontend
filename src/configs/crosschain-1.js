import { bridgeERC20ABIETH, bridgeABIETH } from '../contracts/';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: process.env.REACT_APP_INFURA_API_KEY_1,
  erc20address: '0xd40adfF097E3cde2b96D81A4727F3E47093F3405',
  bridgeAddress: '0x43e9699E2C119061bc62d13fe395e0b8431D03E6',
  erc20ABI: bridgeERC20ABIETH,
  bridgeABI: bridgeABIETH,
  decimals: 18,
  balance: 0
};

export default chain;
