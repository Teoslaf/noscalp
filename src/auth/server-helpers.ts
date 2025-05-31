export const getNewNonces = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return {
    loginNonce: `${timestamp}-${random}`,
    registrationNonce: `${timestamp}-${random}-reg`
  };
}; 