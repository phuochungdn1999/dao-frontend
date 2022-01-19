export const truncateWalletAddress = (address) => {
  return `${address.substr(0, 6)}***${address.substring(address.length - 4)}`;
};
