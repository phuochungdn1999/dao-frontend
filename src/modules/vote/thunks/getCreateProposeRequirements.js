const getCreateProposeRequirements = ({
  web3,
  asset,
  account,
  onError,
  onSuccess
}) => {
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

      const minimum = await governanceContract
        .methods
        .getMinimum()
        .call({ from: account });

      onSuccess && onSuccess(balance > minimum);
    } catch(error) {
      console.error(error?.message);

      onError && onError(error);
    }
  };
};

export default getCreateProposeRequirements;
