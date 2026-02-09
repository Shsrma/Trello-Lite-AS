// backend/src/services/mail.service.js
const transporter = require('../config/mail');
const logger = require('../utils/logger');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

const sendNotificationEmail = async (notification) => {
  try {
    if (!notification.recipient?.email) {
      return;
    }

    const subject = notification.title;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${notification.title}</h2>
        <p style="color: #666; font-size: 16px;">${notification.message}</p>
        ${notification.sender ? `<p style="color: #999; font-size: 14px;">From: ${notification.sender.name}</p>` : ''}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated notification from Trello Lite.</p>
      </div>
    `;
    const text = `${notification.title}\n\n${notification.message}${notification.sender ? `\n\nFrom: ${notification.sender.name}` : ''}`;

    await sendEmail({
      to: notification.recipient.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    logger.error('Notification email error:', error);
  }
};

const sendWelcomeEmail = async (user) => {
  try {
    const subject = 'Welcome to Trello Lite';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Trello Lite, ${user.name}!</h2>
        <p style="color: #666; font-size: 16px;">Thank you for joining us. Start managing your projects efficiently.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">If you have any questions, feel free to reach out to our support team.</p>
      </div>
    `;
    const text = `Welcome to Trello Lite, ${user.name}!\n\nThank you for joining us. Start managing your projects efficiently.`;

    await sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    logger.error('Welcome email error:', error);
  }
};

module.exports = {
  sendEmail,
  sendNotificationEmail,
  sendWelcomeEmail,
};
