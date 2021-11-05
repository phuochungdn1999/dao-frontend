const makeBigNumber = (web3, amount, decimals) => {
  const unit = Object.entries(web3.utils.unitMap).find(([key, value]) => {
    return value.replace(/0(?!.*0)/, '').length === Number(decimals);
  });

  const wei = unit ?
    web3.utils.toWei(amount.toString(), unit[0]) :
    amount * 10 ** decimals;

  return web3.utils.toBN(wei);
};

export default makeBigNumber;
