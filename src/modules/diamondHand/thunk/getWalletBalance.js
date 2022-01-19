export const getUserBalance = async (web3, asset, account) => {
  try {
    const tokenContract = new web3.eth.Contract(
      asset.tokenABI,
      asset.tokenAddress
    );
    const balance = await tokenContract.methods
      .balanceOf(account)
      .call({ from: account });
    return balance;
  } catch (error) {
    console.error(error?.message);
  }
};
