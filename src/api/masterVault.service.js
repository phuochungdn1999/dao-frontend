import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { MasterVaultParams } from '../@types/MasterVaultParams';
import ERC20Abi from '../abi/erc20.abi';
import { MasterVault } from '../abi/MasterVault';
import { config } from '../configs/config';
import { signer } from '../store/action/walletActions';
import { BIG_TEN, BIG_ZERO } from '../utils/bigNumber';
import { jsonRpcProvider, multicall } from './contract.service';
import { approveToken } from './token.service';

const masterVaultContract = new ethers.Contract(config.MASTER_VAULT, MasterVault, jsonRpcProvider);

/**
 * Get Payb tokens for 1 day (default) from farm / staking
 * @param farmId Farm id on contract (default 0 = staking)
 * @param blocks Alternative - Default value 28800 = 1 day
 * @returns tokens amount
 */
const getPaybForFarm = async(farmId = 0, blocks = 28800) => {
  const tokens = await masterVaultContract.functions.getPoolInvervalReturn(farmId, blocks);

  return new BigNumber(tokens.toString()).dividedBy(10 ** config.PAYB_DECIMALS).toNumber();
};

/**
 * Get cooldown period for unstaking
 * @returns Cooldown period for unstaking in seconnds
 */
const getWithdrawalCooldown = async () =>
  Number((await masterVaultContract.functions.unstakePeriod()).toString());

const getMyStakeCooldown = async () => {
  const address = signer.getAddress();
  const cooldownPeriodEnd = await masterVaultContract.functions.cooldownPeriodEnd(address);
  return Number(cooldownPeriodEnd);
};

/**
 * Set withdrawal fee period
 * @param secoonds count of secoonds to set (max 72 hours = 259200)
 * @returns TransactionResponse
 */
const setWithdrawalCooldown = async (secoonds,) => {
  if (secoonds > 259200) {
    throw new Error('Period cannot be more than 72 hours');
  }

  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.setUnstakePeriod(secoonds, {
    nonce,
  });

  return await signer.sendTransaction(unsignedTx);
};

/**
 * Get fee for unstaking
 * @returns Fee for unstaking
 */
const getWithdrawalFee = async () =>
  Number((await masterVaultContract.functions.unstakeFee()).toString());

/**
 * Sets withdraw fee, only callable by owner
 * @param withdrawalFee 100 = 1% (max)
 * @returns TransactionResponse
 */
const setWithdrawalFee = async (
  withdrawalFee,
) => {
  if (withdrawalFee > 100) {
    throw new Error('withdrawFee cannot be more than 100 (1%)');
  }

  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.setUnstakeFee(withdrawalFee, {
    nonce,
  });

  return await signer.sendTransaction(unsignedTx);
};

const getFarmParams = async (farmId = 0,) => {
  const [paybPerBlock, poolInfo, totalAllocPoint] = await Promise.all([
    masterVaultContract.functions.paybPerBlock(),
    masterVaultContract.functions.poolInfo(farmId),
    masterVaultContract.functions.totalAllocPoint(),
  ]);

  return {
    paybPerBlock: new BigNumber(paybPerBlock.toString()).toNumber(),
    poolInfo: {
      lpToken: poolInfo.lpToken,
      allocPoint: new BigNumber(poolInfo.allocPoint.toString()).toNumber(),
      lastRewardBlock: new BigNumber(poolInfo.lastRewardBlock.toString()).toNumber(),
      accPaybPerShare: new BigNumber(poolInfo.accPaybPerShare.toString()).toNumber(),
    },
    totalAllocPoint: new BigNumber(totalAllocPoint.toString()).toNumber(),
  };
};

/**
 * Get multiplier for farm / staking
 * @param farmId Farm id on contract (default 0 = staking)
 * @returns multiplier for farm
 */
const getMultiplier = async (farmId = 0) => {
  const { paybPerBlock, poolInfo, totalAllocPoint } = await getFarmParams(farmId);

  return new BigNumber(paybPerBlock.toString())
    .multipliedBy(poolInfo.allocPoint.toString())
    .dividedBy(totalAllocPoint.toString())
    .toNumber();
};

/**
 * Get address of master token supplier
 * @returns Return address
 */
const getMasterSupplier = async () =>
  await masterVaultContract.functions.masterSupplier();

/**
 * Add Payb tokens to stake
 * @param amount Amount of Payb tokens
 * @returns TransactionResponse
 */
const stake = async (amount) => {
  const amountWithoutDecimals = new BigNumber(amount.toString())
    .multipliedBy(10 ** config.PAYB_DECIMALS)
    .toString();

  await approveToken(config.YFIAG_ADDRESS, config.MASTER_VAULT, amount.toString());

  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.enterStaking(
    amountWithoutDecimals,
    {
      nonce,
    },
  );

  return await signer.sendTransaction(unsignedTx);
};

/**
 * Remove Payb tokens from stake
 * @param amount Amout of Payb tokens
 * @returns TransactionResponse
 */
const unstake = async (amount) => {
  const amountWithoutDecimals = new BigNumber(amount)
    .multipliedBy(10 ** config.PAYB_DECIMALS)
    .toString();

  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.leaveStaking(
    amountWithoutDecimals,
    { nonce },
  );

  return await signer.sendTransaction(unsignedTx);
};

/**
 * Get pending Payb tokens to claim
 * @param farmId Farm id on contract (default 0 = staking)
 * @returns Available Payb tokens to claim
 */
const toClaim = async (farmId = 0) => {
  if (!signer) {
    return 0;
  }
  const userAddress = await signer.getAddress();
  const toClaimAmount = await masterVaultContract.functions.pendingPayb(farmId, userAddress);

  return new BigNumber(toClaimAmount[0].toString())
    .dividedBy(10 ** config.PAYB_DECIMALS)
    .toNumber();
};

/**
 * Claim Payb tokens
 * @returns TransactionResponse
 */
const claim = async () => unstake(0);

/**
 * Get locked amount and unlocked rerward for farm / staking (farmId = 0)
 * @param farmId Farm id on contract (default 0 = staking)
 * @returns {lockedAmount: string, unlockedReward: string} Return locked amount of user and abailable amount to reward
 */
const getUserInfoFromFram = async (
  farmId = 0,
) => {
  const userAddress = await signer.getAddress();
  const userInfo = await masterVaultContract.functions.userInfo(farmId, userAddress);

  return {
    lockedAmount: new BigNumber(userInfo.amount.toString()).dividedBy(10 ** 18).toString(),
    unlockedReward: new BigNumber(userInfo.rewardDebt.toString()).dividedBy(10 ** 18).toString(),
  };
};

/**
 * Fetch farm
 */
const fetchFarm = async (farm) => {
  const { contractIndex, lpToken, token0Address, token1Address } = farm;
  const calls = [
    // Balance of token in the LP contract
    {
      address: token0Address,
      name: 'balanceOf',
      params: [lpToken],
    },
    // Balance of quote token on LP contract
    {
      address: token1Address,
      name: 'balanceOf',
      params: [lpToken],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpToken,
      name: 'balanceOf',
      params: [config.MASTER_VAULT],
    },
    // Total supply of LP tokens
    {
      address: lpToken,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token0Address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: token1Address,
      name: 'decimals',
    },
  ];

  const [
    tokenBalanceLP,
    quoteTokenBalanceLP,
    lpTokenBalanceMC,
    lpTotalSupply,
    tokenDecimals,
    quoteTokenDecimals,
  ] = await multicall(ERC20Abi, calls);

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(
    BIG_TEN.pow(quoteTokenDecimals),
  );

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio);
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));

  // Only make masterchef calls if farm has contractIndex
  const [info, totalAllocPoint] =
    contractIndex || Number(contractIndex) === 0
      ? await multicall(MasterVault, [
          {
            address: config.MASTER_VAULT,
            name: 'poolInfo',
            params: [contractIndex],
          },
          {
            address: config.MASTER_VAULT,
            name: 'totalAllocPoint',
          },
        ])
      : [null, null];

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  // const shareOfPool = new BigNumber(lpTokenBalanceMC).dividedBy(lpTotalSupply);

  // const valueToken0 = new BigNumber(
  //   new BigNumber(tokenAmountTotal).multipliedBy(shareOfPool),
  // ).multipliedBy(farm.t0_usdRate ?? 0);
  // const valueToken1 = new BigNumber(
  //   new BigNumber(quoteTokenAmountTotal).multipliedBy(shareOfPool),
  // ).multipliedBy(farm.t0_usdRate ?? 0);

  // const liquidity = valueToken0.plus(valueToken1).toFixed(2);

  const liquidity = new BigNumber(new BigNumber(tokenAmountTotal))
    .multipliedBy(farm.t0_usdRate ?? 0)
    .plus(new BigNumber(quoteTokenAmountTotal).multipliedBy(farm.t1_usdRate))
    .toFixed(2);

  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}x`,
    allocPoint: allocPoint.toJSON(),
    liquidity,
  };
};
/**
 * End fetch farm
 */

const getMasterValutParams = async () => {
  const [
    [paybVirtual],
    [paybPerBlock],
    [MULTIPLIER],
    [totalAllocPoint],
    [startBlock],
    [MAX_WITHDRAW_PERIOD],
    [MAX_WITHDRAW_FEE],
    [masterSupplier],
    [withdrawalCooldown],
    [withdrawalFee],
    [treasury],
    [poolLength],
    [currentSupplierAllowance],
    [owner],
  ] = await Promise.all([
    masterVaultContract.functions.paybVirtual(),
    masterVaultContract.functions.paybPerBlock(),
    masterVaultContract.functions.rewardMultiplier(),
    masterVaultContract.functions.totalAllocPoint(),
    masterVaultContract.functions.startBlock(),
    masterVaultContract.functions.MAX_UNSTAKE_PERIOD(),
    masterVaultContract.functions.MAX_UNSTAKE_FEE(),
    masterVaultContract.functions.masterSupplier(),
    masterVaultContract.functions.unstakePeriod(),
    masterVaultContract.functions.unstakeFee(),
    masterVaultContract.functions.treasury(),
    masterVaultContract.functions.poolLength(),
    masterVaultContract.functions.currentSupplierAllowance(),
    masterVaultContract.functions.owner(),
  ]);
  return {
    paybVirtual: paybVirtual,
    paybPerBlock: new BigNumber(paybPerBlock.toString()),
    MULTIPLIER: Number(MULTIPLIER.toString()),
    totalAllocPoint: new BigNumber(totalAllocPoint.toString()),
    startBlock: Number(startBlock.toString()),
    MAX_WITHDRAW_PERIOD: Number(MAX_WITHDRAW_PERIOD.toString()),
    MAX_WITHDRAW_FEE: Number(MAX_WITHDRAW_FEE.toString()),
    masterSupplier,
    withdrawalCooldown: new BigNumber(withdrawalCooldown.toString()),
    withdrawalFee: new BigNumber(withdrawalFee.toString()),
    treasury,
    poolLength: Number(poolLength.toString()),
    currentSupplierAllowance: new BigNumber(currentSupplierAllowance.toString()),
    owner,
  };
};

/**
 * Update master supplier address
 * @param address New master supplier address
 * @returns Transaction receipt
 */
const updateMasterSupplier = async (address,) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.updateMasterSupplier(address, {
    nonce,
  });
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

/**
 * Add a new lp to the pool. Can only be called by the owner.
 * DO NOT add the same LP token more than once. Rewards will be messed up if you do.
 * @param allocPoint How many allocation points assigned to this pool. PAYBs to distribute per block.
 * @param lpToken Address of LP token contract.
 * @param withUpdate run massUpdatePools method on contract
 * @returns TransactionReceipt
 */
const addNewFarm = async (
  allocPoint,
  lpToken,
  withUpdate = true,
) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.add(
    allocPoint.toString(),
    lpToken,
    withUpdate,
    { nonce },
  );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

/**
 * Update params of existed pool
 * @param farmId index farm on master vault contract
 * @param allocPoint How many allocation points assigned to this pool. PAYBs to distribute per block.
 * @param withUpdate run massUpdatePools method on contract
 * @returns TransactionReceipt
 */
const updateFarm = async (
  farmId,
  allocPoint,
  withUpdate = true,
) => {
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.set(
    farmId,
    allocPoint.toString(),
    withUpdate,
    { nonce },
  );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

/**
 * Deposit LP tokens to MasterVault for PAYB allocation.
 * @param farm Farm object to interact
 * @param amount Amount of tokens to add to farm
 * @returns TransactionReceipt
 */
const deposit = async (
  farm,
  amount,
) => {
  const tokenAmount = amount.multipliedBy(BIG_TEN.pow(18)).toString();
  await approveToken(farm.lpToken, config.MASTER_VAULT, tokenAmount);

  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.deposit(
    farm.contractIndex,
    tokenAmount,
    { nonce },
  );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

/**
 * Withdraw LP tokens from MasterVault.
 * @param farm Farm object to interact
 * @param amount Amount of tokens to remove from farm
 * @returns TransactionReceipt
 */
const withdraw = async (
  farm,
  amount,
) => {
  const tokenAmount = amount.multipliedBy(BIG_TEN.pow(18)).toString();
  const nonce = await jsonRpcProvider.getTransactionCount(signer.getAddress());

  const unsignedTx = await masterVaultContract.populateTransaction.withdraw(
    farm.contractIndex,
    tokenAmount,
    { nonce },
  );
  const tx = await signer.sendTransaction(unsignedTx);
  return tx.wait();
};

/**
 * Claim Payb tokens
 * @param farm Farm object to interact
 * @returns TransactionReceipt
 */
const claimFromFarm = async (farm) => withdraw(farm, BIG_ZERO);

export const MasterVaultService = {
  getPaybForFarm,
  getWithdrawalCooldown,
  setWithdrawalCooldown,
  getWithdrawalFee,
  setWithdrawalFee,
  getMultiplier,
  getMasterSupplier,
  stake,
  unstake,
  toClaim,
  claim,
  getUserInfoFromFram,
  getFarmParams,
  getMyStakeCooldown,
  fetchFarm,
  getMasterValutParams,
  updateMasterSupplier,
  addNewFarm,
  updateFarm,
  deposit,
  withdraw,
  claimFromFarm,
};
