import { actionTypes } from "../reducers/crosschain";

const getTokenDecimals = async (web3, asset, account) => {
  const tokenContract = new web3.eth.Contract(
    asset.erc20ABI,
    asset.erc20address
  );

  const decimals = await tokenContract.methods
    .decimals()
    .call({ from: account });

  return decimals;
};

const getUserBalance = async (web3, asset, account) => {
  const tokenContract = new web3.eth.Contract(
    asset.erc20ABI,
    asset.erc20address
  );

  const balance = await tokenContract.methods
    .balanceOf(account)
    .call({ from: account });

  return parseFloat(balance) / 10 ** asset.decimals;
};

const getProposalId = async (web3, asset, account) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.erc20ABI,
      "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
    );
    console.log("111", asset.erc20ABI);

    // const proposalId = await vaultContract.methods.getProposalInfo("0").call({
    //   from: account,
    // });

    const proposalId = await vaultContract.methods.proposalId().call({
      from: account,
    });
    console.log("proposalId", proposalId);

    return proposalId;
  } catch (error) {
    console.error(error?.message);
  }
};

const getProposalIdInfo = async (proposalId, web3, asset, account) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.erc20ABI,
      "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
    );
    let proposalData = [];

    for (let index = proposalId - 1; index >= 0; index--) {
      let data = await vaultContract.methods.getProposalInfo(index).call({
        from: account,
      });
      console.log("proposal data", data);
      proposalData.push(data);
    }

    console.log("proposalData", proposalData);

    return proposalData;
  } catch (error) {
    console.error(error?.message);
  }
};

const getPendingMembers = async (web3, asset, account) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.erc20ABI,
      "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
    );
    let proposalData = [];

    let data = await vaultContract.methods.getPendingAddressArr().call({
      from: account,
    });
    console.log("pendingMembersArr", data);
    proposalData.push(data);

    console.log("proposalData", proposalData);

    return proposalData;
  } catch (error) {
    console.error(error?.message);
  }
};

const getAdmins = async (web3, asset, account) => {
  try {
    const vaultContract = new web3.eth.Contract(
      asset.erc20ABI,
      "0x227ba0b472f19E0be2fC526BdD9eB828909F973D"
    );
    let proposalData = [];

    let data = await vaultContract.methods.admin(account).call({
      from: account,
    });
    console.log("pendingMembersArr", data);
    proposalData.push(data);

    console.log("proposalData", proposalData);

    return proposalData;
  } catch (error) {
    console.error(error?.message);
  }
};

const getCrossChainBalances = ({ web3, asset, account }) => {
  return (dispatch) => {
    web3 &&
      asset &&
      account &&
      dispatch({
        type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
        payload: true,
      });

    web3 &&
      asset &&
      account &&
      getTokenDecimals(web3, asset, account)
        .then((decimals) => {
          asset.decimals = decimals;

          getUserBalance(web3, asset, account)
            .then((balance) => {
              asset.balance = balance;
              getProposalId(web3, asset, account)
                .then((proposalId) => {
                  getProposalIdInfo(proposalId, web3, asset, account)
                    .then((proposalData) => {
                      asset.proposalData = proposalData;
                      // console.log("proposalData: ",proposalData)
                      getPendingMembers(web3, asset, account)
                        .then((pendingMembersArr) => {
                          asset.pendingMembersArr = pendingMembersArr;
                          getAdmins(web3, asset, account)
                            .then((isAdmin) => {
                              asset.isAdmin = isAdmin;
                              dispatch({
                                type: actionTypes.CROSSCHAIN_CHAIN_UPDATE,
                                payload: asset,
                              });

                              dispatch({
                                type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                                payload: false,
                              });
                            })
                            .catch((error) => {
                              console.error(error?.message || error);

                              dispatch({
                                type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                                payload: false,
                              });
                            });
                        })
                        .catch((error) => {
                          console.error(error?.message || error);

                          dispatch({
                            type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                            payload: false,
                          });
                        });
                    })
                    .catch((error) => {
                      console.error(error?.message || error);

                      dispatch({
                        type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                        payload: false,
                      });
                    });
                })
                .catch((error) => {
                  console.error(error?.message || error);

                  dispatch({
                    type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                    payload: false,
                  });
                });
            })
            .catch((error) => {
              console.error(error?.message || error);

              dispatch({
                type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
                payload: false,
              });
            });
        })
        .catch((error) => {
          console.error(error?.message || error);

          dispatch({
            type: actionTypes.CROSSCHAIN_LOADING_UPDATE,
            payload: false,
          });
        });
  };
};

export default getCrossChainBalances;
