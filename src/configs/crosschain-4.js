import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0x4771E0c8dcd97889EC7fEAE13c3d9a94f5D91332',
  bridgeAddress: '0xF497ab9DACf2C47a3Bdaf37CFf91f0BB81F71dCf',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
