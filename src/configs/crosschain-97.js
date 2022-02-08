import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0x893903218a2e2849Ee05B359b1F4503F712532e4',
  bridgeAddress: '0xE96782108366e4C295AFBCAA3756c612a68192bf',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
