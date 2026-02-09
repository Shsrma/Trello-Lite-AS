// backend/src/services/auth.service.js
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

const register = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;

  return userObject;
};

const login = async (email, password) => {
  const user = await User.findOne({ email, isActive: true }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = { userId: user._id, email: user.email, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken, true);
    
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const payload = { userId: user._id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
