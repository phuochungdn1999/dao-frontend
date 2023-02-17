import Web3 from 'web3';

const makeWeb3Instance = (chains, chainId, infuraApiKey) => {
  return new Promise((resolve, reject) => {
    const findedChain = chains.find((item) => item?.chainId === chainId);
    console.log("findedChain",findedChain)

    const rpcLink = chains !== 56 && chains !== 97 ?
      findedChain?.rpc[0]?.replace('${INFURA_API_KEY}', infuraApiKey) :
      findedChain?.rpc[0];

    rpcLink ?
      resolve(new Web3(rpcLink)) :
      reject(new Error('RPC chain url not found!'));
  });
};

const getTransactionStatus = async (web3, asset, nonce, account) => {
  const bridgeContract = new web3.eth.Contract(
    asset.bridgeABI,
    asset.bridgeAddress
  );

  const processedTransaction = await bridgeContract
    .methods
    .processedTransactions(account, nonce)
    .call({ from: account });

  return processedTransaction;
};

const checkTransaction = ({
  asset,
  nonce,
  chains,
  chainId,
  account,
  onError,
  onSuccess
}) => {
  return (dispatch) => {
    makeWeb3Instance(chains, chainId, asset.infuraApiKey)
      .then((web3) => {
        getTransactionStatus(web3, asset, nonce, account)
          .then((result) => onSuccess && onSuccess(result))
          .catch((error) => onError && onError(error));
      })
      .catch((error) => onError && onError(error));
  };
};

export default checkTransaction;
