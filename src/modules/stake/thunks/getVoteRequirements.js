const getVoteRequirements = ({ web3, asset, account, onError, onSuccess }) => {
  return async (dispatch) => {
    try {
      const governanceContract = new web3.eth.Contract(
        asset.governanceABI,
        asset.governanceAddress
      );

      const balance = await governanceContract
        .methods
        .balanceOf(account)
        .call({ from: account });

      const voteLock = await governanceContract
        .methods
        .voteLock(account)
        .call({ from: account });

      const currentTimestamp = Math.round(new Date().getTime() / 1000);

      onSuccess && onSuccess({
        voteLock: voteLock,
        balanceValid: parseFloat(balance) / 1e18 > 1000,
        voteLockValid: voteLock > currentTimestamp
      });
    } catch(error) {
      console.error(error?.message);

      onError && onError(error);
    }
  };
};

export default getVoteRequirements;
