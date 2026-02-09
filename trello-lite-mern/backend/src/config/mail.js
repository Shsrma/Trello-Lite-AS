// backend/src/config/mail.js
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Email service is ready');
  } catch (error) {
    logger.error('Email service error:', error);
  }
};

verifyConnection();

module.exports = transporter;
