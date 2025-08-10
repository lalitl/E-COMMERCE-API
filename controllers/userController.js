const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("User Does not Exists!");
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please fill all required fields");
  }

  const user = await User.findById({ _id: req.user.userID });
  const isOldPasswordCorrect = await user.compare(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      "Your Existing password is incorrect"
    );
  }
  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .send("User password has been successfully updated");
};

//update user using user.save()
const updateUser = async (req, res) => {
  console.log(req.body);

  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError(
      "Please enter all the required fields"
    );
  }

  const user = await User.findOne({ _id: req.user.userID }).select("-password");
  user.name = name;
  user.email = email;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ msg: "User Info updated Successfully!", user: tokenUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

//update user using findOneAndUpdate

// const updateUser = async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     throw new CustomError.BadRequestError(
//       "Please fill all the required fields"
//     );
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userID },
//     {
//       name,
//       email,
//     },
//     { new: true, runValidators: true }
//   ).select("-password");

//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });

//   res
//     .status(StatusCodes.OK)
//     .json({ msg: "User Info updated Successfully!", user: tokenUser });
// };
