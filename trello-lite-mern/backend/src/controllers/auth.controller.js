// backend/src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const mailService = require('../services/mail.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    
    await mailService.sendWelcomeEmail(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};
