export const signMessage = (nonce: String, userAddress: String) => {
  return `Please sign this message from address ${userAddress}:\n\n${nonce} `;
};
