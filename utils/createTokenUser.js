const createTokenUser = ({ _id, name, role }) => {
  const tokenUser = { userID: _id, name: name, role: role };
  return tokenUser;
};

module.exports = createTokenUser;
