const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,         // your Gmail (e.g. visheshshah.414@gmail.com)
    pass: process.env.GMAIL_APP_PASSWORD  // 16-character app password
  }
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Lokotsav" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = sendEmail;
