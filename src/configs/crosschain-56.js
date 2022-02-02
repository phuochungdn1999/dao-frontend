import { bridgeERC20ABIBSC, bridgeABIBSC } from '../contracts/';

const chain = {
  id: 'yfiag',
  name: 'YFIAG',
  symbol: 'YFIAG',
  infuraApiKey: null,
  erc20address: '0x1F64703ae00C06420dd21fE75E9Ef6E008212263',
  bridgeAddress: '0x62a40D8EF6888f331a4d180aF612CF99b014c02d',
  erc20ABI: bridgeERC20ABIBSC,
  bridgeABI: bridgeABIBSC,
  decimals: 18,
  balance: 0
};

export default chain;
