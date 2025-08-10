const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new CustomError.BadRequestError("Please enter a different email");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ user: tokenUser, res });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please enter a valid email and password"
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("User does not Exists");
  }

  const correctPassword = await user.compare(password);

  if (!correctPassword) {
    throw new CustomError.UnauthenticatedError("Please enter a valid password");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ user: tokenUser, res });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("User logged out!");
};

module.exports = { register, login, logout };
