export const isWalletConnectMethod = (method) => {
  return ['METAMASK', 'TRUST_WALLET', 'WALLET_CONNECT', 'TOKEN_POCKET', 'BINANCE_CHAIN'].some(
    (connectMethod) => connectMethod === method,
  );
};
