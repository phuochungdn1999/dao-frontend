import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts';

const chain = {
  id: 'yfiag',
  name: 'BCX',
  symbol: 'BCX',
  infuraApiKey: null,
  erc20address: '0x5be5DB0eFc84E0F5A1a4D85145dc7B4F222B738F',
  bridgeAddress: '0xF3963B6c8E6C5147B8ba01A8056B99C8CDdcfeB3',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
