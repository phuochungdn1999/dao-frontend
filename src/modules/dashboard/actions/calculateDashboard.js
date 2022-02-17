import { getAPY } from '../../vaults';

const calculateVaultGrowth = (vault, apy, time, coin) => {
  return vault.prices[coin] ?
    vault.vaultBalance *
    vault.pricePerFullShare *
    (apy / time) *
    vault.prices[coin] :
    0;
};

const calculateDashboard = (vaults, prices, basedOn = 0) => {
  // FILTER USED VAULTS AND CALCULATE VAULT ASSET BALANCES
  const vaultsInUse = vaults?.filter((vault) => {
    return vault.id !== 'ETH' && vault.vaultBalance > 0.0001;
  })?.map((vault) => {
    // const apy = getAPY(vault, basedOn); remove using new APY getAPYNew from vaults
    vault.prices = prices[vault.price_id];
    vault.usdBalance =
      vault.vaultBalance * vault.pricePerFullShare * (vault.prices?.usd || 1);
    vault.vaultGrowth_daily_usd =
      calculateVaultGrowth(vault, vault.apy, 36500, 'usd');
    vault.vaultGrowth_weekly_usd =
      calculateVaultGrowth(vault, vault.apy, 5200, 'usd');
    vault.vaultGrowth_yearly_usd =
      calculateVaultGrowth(vault, vault.apy, 100, 'usd');

    vault.ethBalance =
      vault.vaultBalance * vault.pricePerFullShare * (vault.prices?.eth || 1);
    vault.vaultGrowth_daily_eth =
      calculateVaultGrowth(vault, vault.apy, 36500, 'eth');
    vault.vaultGrowth_weekly_eth =
      calculateVaultGrowth(vault, vault.apy, 5200, 'eth');
    vault.vaultGrowth_yearly_eth =
      calculateVaultGrowth(vault, vault.apy, 100, 'eth');

    return vault;
  });

  // CALCULATE VAULT BALANCES AND DAILY GROWTH
  const vaultBalances = vaultsInUse?.reduce((accumulator, vault) => {
    accumulator.vaultBalance_usd =
      accumulator.vaultBalance_usd + vault.usdBalance;
    accumulator.vaultGrowth_daily_usd =
      accumulator.vaultGrowth_daily_usd + vault.vaultGrowth_daily_usd;
    accumulator.vaultGrowth_weekly_usd =
      accumulator.vaultGrowth_weekly_usd + vault.vaultGrowth_weekly_usd;
    accumulator.vaultGrowth_yearly_usd =
      accumulator.vaultGrowth_yearly_usd + vault.vaultGrowth_yearly_usd;

    accumulator.vaultBalance_eth =
      accumulator.vaultBalance_eth + vault.ethBalance;
    accumulator.vaultGrowth_daily_eth =
      accumulator.vaultGrowth_daily_eth + vault.vaultGrowth_daily_eth;
    accumulator.vaultGrowth_weekly_eth =
      accumulator.vaultGrowth_weekly_eth + vault.vaultGrowth_weekly_eth;
    accumulator.vaultGrowth_yearly_eth =
      accumulator.vaultGrowth_yearly_eth + vault.vaultGrowth_yearly_eth;

    return accumulator;
  }, {
    vaultBalance_usd: 0,
    vaultGrowth_daily_usd: 0,
    vaultGrowth_weekly_usd: 0,
    vaultGrowth_yearly_usd: 0,
    vaultBalance_eth: 0,
    vaultGrowth_daily_eth: 0,
    vaultGrowth_weekly_eth: 0,
    vaultGrowth_yearly_eth: 0
  });

  // CALCULATE PORTFOLIO (earn + vault) BALANCES
  const dashboard = {
    portfolio_balance_usd: vaultBalances?.vaultBalance_usd || 0,
    portfolio_growth_usd_daily: vaultBalances?.vaultGrowth_daily_usd || 0,
    portfolio_growth_usd_weekly: vaultBalances?.vaultGrowth_weekly_usd || 0,
    portfolio_growth_usd_yearly: vaultBalances?.vaultGrowth_yearly_usd || 0,

    portfolio_balance_eth: vaultBalances?.vaultBalance_eth || 0,
    portfolio_growth_eth_daily: vaultBalances?.vaultGrowth_daily_eth || 0,
    portfolio_growth_eth_weekly: vaultBalances?.vaultGrowth_weekly_eth || 0,
    portfolio_growth_eth_yearly: vaultBalances?.vaultGrowth_yearly_eth || 0,

    vaults: vaultsInUse
  };

  return dashboard;
};

export default calculateDashboard;
