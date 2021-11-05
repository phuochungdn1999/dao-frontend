const getAPY = (asset, basedOn) => {
  const { stats, apy } = asset;

  const initialApy = 0;

  if (stats) {
    switch (basedOn) {
      case 1:
        return stats.apyOneWeekSample || initialApy;
      case 2:
        return stats.apyOneMonthSample || initialApy;
      default:
        return stats.apyInceptionSample || initialApy;
    }
  } else if (apy) {
    return apy;
  } else {
    return initialApy;
  }
};

export default getAPY;
