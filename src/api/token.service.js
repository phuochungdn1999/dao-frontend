import BigNumber from "bignumber.js";
import { Contract, ethers } from "ethers";
import ERC20Abi from "../abi/erc20.abi";
import YFIAG from "../abi/YFIAG.abi.json";
import { config } from "../configs/config";
import { signer, web3Provider } from "../store/action/walletActions";
import { default as numberToPlainString } from "../utils/numberToPlainString";
import { BIG_TEN } from "../utils/bigNumber";
import { getTxObject, jsonRpcProvider, readContract } from "./contract.service";
import { connectByWeb3Provider } from "../store/action/walletActions";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

export const convertToFixed = (number, decimals) => {
  return new BigNumber(number)
    .multipliedBy(Math.pow(10, Number(decimals)))
    .toFixed(0)
    .toString();
};

export const convertFromFixed = (number, decimals) => {
  return numberToPlainString(
    new BigNumber(number).dividedBy(Math.pow(10, Number(decimals))).toString()
  );
};

export const approveToken = async (tokenAddress, address, tokenAmount) => {
  const tokenContract = new ethers.Contract(tokenAddress, YFIAG, signer);
  // const decimals = await readContract(tokenContract, 'decimals');
  const from = await signer.getAddress();
  const [decimals] = await Promise.all([
    tokenContract.functions.decimals(),
    tokenContract.functions.allowance(from, address),
  ]);

  const approveTx = await getTxObject(
    tokenContract,
    "approve(address,uint256)",
    address,
    convertToFixed(tokenAmount, decimals)
  );

  const approveSent = await signer.sendTransaction(approveTx);

  return approveSent.wait();
};
export const approveTokenNoDecimal = async (
  YFIAGaddress,
  diamondhandAddress,
  tokenAmount,
  providers
) => {
  let signer = await connectByWeb3Provider(providers);
  const tokenContract = new ethers.Contract(YFIAGaddress, YFIAG, signer);
  let provider = await detectEthereumProvider();
  web3.eth.getAccounts().then(console.log);

  const approveTx = await getTxObject(
    tokenContract,
    "approve(address,uint256)",
    diamondhandAddress,
    convertToFixed(tokenAmount, 18)
  );

  const approveSent = await signer.sendTransaction(approveTx);

  // const approveSent = await web3.eth.sendTransaction({
  //   from: accountAddress,
  //   to: tokenAddress,
  //   value: convertToFixed(tokenAmount, 18)
  // });

  return approveSent.wait();
};
/**
 * Increase allowance on token
 * @param tokenAddress Token address to increase allowance
 * @param address Spender address
 * @param tokenAmount big number tokens amount with decimals
 */
export const increaseAllowance = async (tokenAddress, address, tokenAmount) => {
  const contract = new ethers.Contract(tokenAddress, ERC20Abi, signer);
  const decimals = await contract.functions.decimals();

  const tx = await contract.functions.increaseAllowance(
    address,
    tokenAmount.multipliedBy(BIG_TEN.pow(decimals)).toString()
  );

  return tx.wait();
};

export const getTokenDecimals = async (tokenAddress) => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ERC20Abi,
    jsonRpcProvider
  );
  const decimals = await readContract(tokenContract, "decimals");
  return decimals;
};

export const getTokenBalance = async (
  tokenAddress,
  tokenDecimals,
  fromAddress
) => {
  try {
    let decimals = tokenDecimals;

    if (!decimals) {
      decimals = await getTokenDecimals(tokenAddress); //as number;
    }

    const tokenContract = new Contract(tokenAddress, ERC20Abi, web3Provider);
    const from = fromAddress || (await signer.getAddress());
    const balance = await tokenContract.balanceOf(from); //as ethers.BigNumber;
    return new BigNumber(balance.toString()).dividedBy(10 ** decimals);
  } catch {
    return 0;
  }
};

export const getTotalSupply = async (tokenAddress, decimals) => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20Abi,
      jsonRpcProvider
    );
    const totalSupply = await readContract(tokenContract, "totalSupply");

    return convertFromFixed(totalSupply, decimals);
  } catch {
    return "0";
  }
};

export const getTotalSupplyDiamondHand = async (provider) => {
  try {
    const tokenContract = new ethers.Contract(
      config.YFIAG_ADDRESS,
      ERC20Abi,
      jsonRpcProvider
    );
    const totalSupply = await readContract(
      tokenContract,
      "balanceOf",
      config.DIAMOND_HAND
    );
    return convertFromFixed(totalSupply, config.YFIAG_DECIMALS);
  } catch {
    return "0";
  }
};

export const getTokenNameAndSymbol = async (tokenAddress) => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20Abi,
      jsonRpcProvider
    );
    const name = await readContract(tokenContract, "name");
    const symbol = await readContract(tokenContract, "symbol");

    return {
      name,
      symbol,
    };
  } catch {
    return null;
  }
};
