import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { DiamondHandContractAbi as DiamondHand } from "../abi/DiamondHandAbi";
import { config } from "../configs/config";
import { signer } from "../store/action/walletActions";
import { jsonRpcProvider } from "./contract.service";
import { approveTokenNoDecimal } from "./token.service";
import { connectByWeb3Provider } from "../store/action/walletActions";

const diamondHandContract = new ethers.Contract(
  config.DIAMOND_HAND,
  DiamondHand,
  jsonRpcProvider
);

const getFarmParams = async (farmId = 0) => {
  const [poolInfo] = await Promise.all([
    diamondHandContract.functions.poolInfo(farmId),
  ]);
  return {
    poolInfo: poolInfo,
  };
};

/**
 * Get address of master token supplier
 * @returns Return address
 */
const getTreasury = async () => await diamondHandContract.functions.TREASURY();

/**
 * Add Payb tokens to stake
 * @param amount Amount of Payb tokens
 * @returns TransactionResponse
 */
const stakeV2 = async (poolSetting, amount, accountAddress, provider) => {
  const amountWithoutDecimals = new BigNumber(amount.toString())
    .multipliedBy(10 ** config.YFIAG_DECIMALS)
    .toString();
  await approveTokenNoDecimal(
    config.YFIAG_ADDRESS,
    config.DIAMOND_HAND,
    amount.toString(),
    provider
  );

  let signer = await connectByWeb3Provider(provider);
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());
  const unsignedTx = await diamondHandContract.populateTransaction.deposit(
    amountWithoutDecimals,
    poolSetting,
    {
      nonce,
    }
  );

  return await signer.sendTransaction(unsignedTx);
};

/**
 * Remove Payb tokens from stake
 * @param amount Amout of Payb tokens
 * @returns TransactionResponse
 */
const unstakeV2 = async (provider, poolId) => {
  let signer = await connectByWeb3Provider(provider);
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await diamondHandContract.populateTransaction.withdraw(
    signer.getAddress(),
    poolId,
    { nonce }
  );

  return await signer.sendTransaction(unsignedTx);
};

/**
 * Get pending Payb tokens to claim
 * @param farmId Farm id on contract (default 0 = staking)
 * @returns Available Payb tokens to claim
 */
const toClaimV2 = async (farmId = 0, provider) => {
  let signer = await connectByWeb3Provider(provider);
  if (!signer) {
    return 0;
  }
  const userAddress = await signer.getAddress();
  const toClaimAmount = await diamondHandContract.functions.pendingPAYB(
    farmId,
    userAddress
  );
  return new BigNumber(toClaimAmount[0].toString())
    .dividedBy(10 ** config.YFIAG_DECIMALS)
    .dividedBy(10 ** 12)
    .toNumber();
};

/**
 * Get locked amount and unlocked rerward for farm / staking (farmId = 0)
 * @param farmId Farm id on contract (default 0 = staking)
 * @returns {lockedAmount: string, unlockedReward: string} Return locked amount of user and abailable amount to reward
 */
export const getUserInfoFromFarmV2 = async (farmId) => {
  const userInfo = await diamondHandContract.functions.poolInfo(farmId);

  return {
    lockedAmount: new BigNumber(userInfo.amount.toString())
      .dividedBy(10 ** config.YFIAG_DECIMALS)
      .toString(),
    depositedAt: new BigNumber(userInfo.depositedAt.toString()).toString(),
    apy: new BigNumber(userInfo.apy.toString()).toString(),
    claimed: userInfo.claimed,
  };
};

/**
 * Update master supplier address
 * @param address New master supplier address
 * @returns Transaction receipt
 */
const updateTreasury = async (address) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx =
    await diamondHandContract.populateTransaction.updateTreasury(address, {
      nonce,
    });
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

const updatePoolApySetting = async (setingId, apy) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx =
    await diamondHandContract.populateTransaction.updatePoolApySetting(
      setingId,
      apy.toString(),
      { nonce }
    );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};
const updatePoolDurationSetting = async (setingId, duration) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx =
    await diamondHandContract.populateTransaction.updatePoolDurationSetting(
      setingId,
      duration.toString(),
      { nonce }
    );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};
export const DiamondHandService = {
  stakeV2,
  unstakeV2,
  toClaimV2,
  getUserInfoFromFarmV2,
  getFarmParams,
  updatePoolDurationSetting,
  updatePoolApySetting,
  updateTreasury,
  getTreasury,
};
