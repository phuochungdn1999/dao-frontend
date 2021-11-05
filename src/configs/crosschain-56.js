import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts/';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0x27863fA361e08dd1971f0819e160cE44aB5E1B0b',
  bridgeAddress: '0x5aa45aA849a1B21498d3b70Dbc792EFbEEF9509b',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
