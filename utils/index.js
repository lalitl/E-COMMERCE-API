const { signJWT, isValidToken, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");

module.exports = {
  signJWT,
  isValidToken,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
};
