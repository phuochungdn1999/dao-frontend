export const getSixDigitsAfterComma = (value) => {
  let valueAsString = value.toString();

  let matchResult = valueAsString.match(/(^-?\d+(?:(\.|,)\d{0,6})?)/g);

  if (matchResult && matchResult.length > 0) return matchResult[0];

  return valueAsString;
};
