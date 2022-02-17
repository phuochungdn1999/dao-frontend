const getAPY = (asset, basedOn) => {
  const { stats, apy } = asset;

  const initialApy = 0;
  // if (stats) {
  //   switch (basedOn) {
  //     case 1:
  //       // return stats.apyOneWeekSample || initialApy;
  //       return apy / 12;
  //     case 2:
  //       // return stats.apyOneMonthSample || initialApy;
  //       return apy;
  //     default:
  //       // return stats.apyInceptionSample || initialApy;
  //       return apy / 52;
  //   }
  // } else 
  if (apy) {
    return apy;
  } else {
    return initialApy;
  }
};

export default getAPY;
