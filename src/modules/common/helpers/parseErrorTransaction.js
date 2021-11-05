const parseErrorTransaction = (
  errorObject,
  errorText = 'Transaction has been reverted by the EVM:'
) => {
  const errorMessage = errorObject.message.startsWith(errorText) ?
    `${errorText} ${JSON.parse(
      errorObject.message.slice(errorText.length)
    )?.transactionHash}` :
    errorObject.message;

  errorObject.message = errorMessage;

  return errorObject;
};

export default parseErrorTransaction;
