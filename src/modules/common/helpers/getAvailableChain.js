const getAvailableChain = (chain, list) => {
  const result = list.find(({ id }) => id === chain);

  return result?.list || null;
};

export default getAvailableChain;
