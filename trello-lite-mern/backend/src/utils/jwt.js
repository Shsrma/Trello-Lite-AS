// backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
