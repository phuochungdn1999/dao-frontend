import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0xcf81Cc9683C298af77c97FcCA3F1F4f8afF4a22F',
  bridgeAddress: '0x36501c4aBF73b400B00EA2406cB2Cf9668F0D805',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
