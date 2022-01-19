import BigNumber from "bignumber.js";
import fs from "fs";
export class Utilitites {
  static syncDirsPath(path) {
    const dirs = path.split("/");
    let syncPath = "";
    dirs.forEach((d) => {
      if (d.length > 0) {
        if (!fs.existsSync(`${syncPath}${d}`)) {
          fs.mkdirSync(`${syncPath}${d}`);
        }
        syncPath += `${d}/`;
      }
    });
  }

  static calcRateFromLp(
    returnRate,
    t0USDRate,
    t1USDRate,
    lp0,
    lp1
  ) {
    if (returnRate === "token0" && t1USDRate > 0) {
      return new BigNumber(lp1).dividedBy(lp0).multipliedBy(t1USDRate);
    }
    if (returnRate === "token1" && t0USDRate > 0) {
      return new BigNumber(lp0).dividedBy(lp1).multipliedBy(t0USDRate);
    }
    return new BigNumber(0);
  }

  static intervals = new Map([
    ["1", 60],
    ["5", 300],
    ["15", 900],
    ["30", 1800],
    ["1H", 3600],
    ["2H", 7200],
    ["4H", 14400],
    ["12H", 43200],
    ["24H", 86400],
  ]);
}
