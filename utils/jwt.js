const jwt = require("jsonwebtoken");

const signJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = signJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const isValidToken = (token) => {
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  return isValid;
};

module.exports = { signJWT, isValidToken, attachCookiesToResponse };
