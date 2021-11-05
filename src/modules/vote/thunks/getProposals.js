import CryptoJS from 'crypto-js';
import async from 'async';
import axios from 'axios';

import { actionTypes } from '../reducers/proposals';

const getProposalCount = async (web3, asset, account) => {
  const governanceContract = new web3.eth.Contract(
    asset.governanceABI,
    asset.governanceAddress
  );

  const proposals = await governanceContract
    .methods
    .getProposalCount()
    .call({ from: account });

  return proposals;
};

const getProposalsList = async (web3, asset, from, count, account) => {
  const governanceContract = new web3.eth.Contract(
    asset.governanceABI,
    asset.governanceAddress
  );

  const proposals = await governanceContract
    .methods
    .getProposals(from, count)
    .call({ from: account });

  const keys = Object.keys(proposals);

  const newProposals = [];

  for (let i = 0; i < count; i++) {
    const singleProposal = {};

    keys.map((item) => singleProposal[item] = proposals[item][i]);

    newProposals.push(singleProposal);
  }

  return newProposals;
};

const getProposalForVotes = async (web3, asset, account, proposalId) => {
  const governanceContract = new web3.eth.Contract(
    asset.governanceABI,
    asset.governanceAddress
  );

  const votes = await governanceContract
    .methods
    .getProposalForVotes(proposalId, account)
    .call({ from: account });

  return votes;
};

const getProposalAgainstVotes = async (web3, asset, account, proposalId) => {
  const governanceContract = new web3.eth.Contract(
    asset.governanceABI,
    asset.governanceAddress
  );

  const votes = await governanceContract
    .methods
    .getProposalAgainstVotes(proposalId, account)
    .call({ from: account });

  return votes;
};

const encodeProposalHash = (hash) => {
  return new Promise((resolve) => {
    const bytes = CryptoJS.AES.decrypt(
      hash,
      process.env.REACT_APP_PROPOSAL_SECRET_PHRASE
    );
    const text = bytes.toString(CryptoJS.enc.Utf8);

    resolve(text);
  });
};

const createProposalsDescription = (id, host, description) => {
  id && description && axios.post(
    `${host}/proposal/create`,
    { id, description }
  )
    .catch((error) => {
      console.error('error', error);
    });
};

const getProposalsDescription = (host, proposals) => {
  return new Promise((resolve, reject) => {
    const ids = proposals?.map((item) => item.id);

    axios.post(`${host}/proposal/get`, { id: ids })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getProposalsDetails = (web3, asset, account, proposals, dispatch) => {
  async.map(proposals, (proposal, callback) => {
    async.parallel([
      (callbackInner) => {
        if (proposal?.description) {
          callbackInner(null, proposal.description);
        } else {
          encodeProposalHash(proposal.ipfsCid)
            .then((item) => {
              createProposalsDescription(proposal.id, asset.apiHost, item);

              callbackInner(null, item);
            })
            .catch((error) => {
              console.log(`Proposal ${proposal.id}`, error?.message);

              callbackInner(null, null);
            });
        }
      },
      (callbackInner) => {
        getProposalForVotes(web3, asset, account, proposal.id)
          .then((item) => callbackInner(null, item))
          .catch((error) => callbackInner(error, null));
      },
      (callbackInner) => {
        getProposalAgainstVotes(web3, asset, account, proposal.id)
          .then((item) => callbackInner(null, item))
          .catch((error) => callbackInner(error, null));
      }
    ], (error, data) => {
      if (error) {
        return callback(error);
      }

      const myVotes = Number(data[1]) || Number(data[2]) || 0;
      const totalVotes = Number(proposal.totalForVotes) +
        Number(proposal.totalAgainstVotes);

      proposal.myVotesRatio = totalVotes ? myVotes / totalVotes : 0;
      proposal.description = data[0];
      proposal.direction = data[1] > data[2] ?
        'FOR' :
        data[1] < data[2] ?
          'AGAINST' :
          'EQUAL';
      proposal.usedVotes = Math.abs(
        Number(data[1]) - Number(data[2])
      );
      proposal.myVotes = myVotes;

      callback(null, proposal);
    })
  }, (error, proposals) => {
    error && console.error(error?.message);

    !error && proposals && dispatch({
      type: actionTypes.PROPOSALS_LIST_UPDATE,
      payload: proposals
    });

    dispatch({
      type: actionTypes.PROPOSALS_LOADING_UPDATE,
      payload: false
    });
  });
};

const getProposals = ({ web3, asset, account }) => {
  return (dispatch) => {
    web3 && asset && account && dispatch({
      type: actionTypes.PROPOSALS_LOADING_UPDATE,
      payload: true
    });

    web3 && asset && account && getProposalCount(web3, asset, account)
      .then((proposalCount) => {
        getProposalsList(web3, asset, 0, proposalCount, account)
          .then((proposals) => {
            getProposalsDescription(asset.apiHost, proposals)
              .then((list) => {
                proposals.map((item) => {
                  const proposal = list.find(({ id }) => id === item.id);

                  item.description = proposal?.description || null;

                  return item;
                });

                getProposalsDetails(web3, asset, account, proposals, dispatch);
              })
              .catch((error) => {
                console.log(error?.message || error);

                getProposalsDetails(web3, asset, account, proposals, dispatch);
              });
          })
          .catch((error) => {
            error && console.error(error?.message || error);

            dispatch({
              type: actionTypes.PROPOSALS_LOADING_UPDATE,
              payload: false
            });
          });
      })
      .catch((error) => {
        error && console.error(error?.message);

        dispatch({
          type: actionTypes.PROPOSALS_LOADING_UPDATE,
          payload: false
        });
      });
  };
};

export default getProposals;
