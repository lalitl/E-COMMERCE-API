const CustomError = require("../errors");
const { isValidToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Please provide a valid token");
  }

  try {
    const { userID, name, role } = isValidToken(token);
    req.user = {
      userID,
      name,
      role,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Please a valid token");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route!"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
