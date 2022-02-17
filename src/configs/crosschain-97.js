import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0x7279b9747aF5195172FB16b58505fAA2c0A81Cb9',
  bridgeAddress: '0x1ca5CFf1ab2A0b69C1E0A1d3cFb6D951681813d0',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
