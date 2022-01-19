import { ethers } from 'ethers';
import { multicallABI } from '../abi/multicall.abi';
import { config, dev } from '../configs/config';
import { web3Provider } from '../store/action/walletActions';

export const jsonRpcProvider = new ethers.providers.JsonRpcBatchProvider(
  dev()
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed3.defibit.io/',
);

export const readContract = async (
  contract,
  method,
  ...params
) => {
  return contract.functions[method](...params);
};

export const getTxObject = async (
  contract,
  method,
  ...params
) => {
  const txObject = await contract.populateTransaction[method](...params);
  txObject.gasLimit = await web3Provider.estimateGas(txObject);
  txObject.nonce = await web3Provider.getTransactionCount(txObject.from ?? '');
  txObject.gasPrice = await web3Provider.getGasPrice();

  return txObject;
};
export const getTxObjectWithGasLimit = async (
  contract,
  gasLimit,
  method,
  ...params
) => {
  const txObject = await contract.populateTransaction[method](...params);

  txObject.gasLimit = ethers.BigNumber.from(gasLimit);
  txObject.nonce = await web3Provider.getTransactionCount(txObject.from ?? '');
  txObject.gasPrice = await web3Provider.getGasPrice();

  return txObject;
};

export const multicall = async (abi, calls) => {
  try {
    const multicallContract = new ethers.Contract(
      config.MULTICALL_ADDRESS,
      multicallABI,
      jsonRpcProvider,
    );
    const abiInterface = new ethers.utils.Interface(abi);
    const callData = calls.map(call => [
      call.address.toLowerCase(),
      abiInterface.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multicallContract.callStatic.aggregate(
      callData,
    );
    const res = returnData.map((call, i) =>
      abiInterface.decodeFunctionResult(calls[i].name, call),
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
