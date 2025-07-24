const nodemailer = require('nodemailer');
const db = require('../config/database')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,         // your Gmail (e.g. visheshshah.414@gmail.com)
    pass: process.env.GMAIL_APP_PASSWORD  // 16-character app password
  }
});

async function sendEmail(to, subject, html,type) {


  try {
    const [rows] = await db.query(`select count(*) as count from tbl_email_logs where email_sent_to=? and sent_for=?`,
      [to,type]
    )
    if(rows[0].count>2){
      throw new Error('Email Limit exceeded.Max 2 emails can be sent.check spam folder once')
    }else{
      let [res1] = await db.query(`insert into tbl_email_logs (email_sent_to,sent_for) values(?,?)`,
        [to,type]
      )
         if(res1.affectedRows==0){
          throw new Error('database insertion error with email')
        }
    }
      const mailOptions = {
    from: `"Lokotsav" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  };
    const info = await transporter.sendMail(mailOptions);
    
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email'+ error.message);
  }
}

module.exports = sendEmail;
