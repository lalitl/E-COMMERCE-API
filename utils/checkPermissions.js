const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser);
  //   console.log(typeof requestUser);
  //   console.log(resourceUserId);
  if (requestUser.role === "admin") return;

  if (requestUser.userID === resourceUserId.toString()) return;

  throw new CustomError.UnauthorizedError("Unauthorized access to this route!");
};

module.exports = checkPermissions;
