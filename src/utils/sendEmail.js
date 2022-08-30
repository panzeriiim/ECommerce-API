const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '3ddd72ecb2cf7d',
      pass: '8a51099cce5b9a',
    },
  });
  const mailOption = {
    from: 'Admin <admin33@mailer.io>',
    to: option.email,
    subjet: option.subject,
    text: option.message,
  };
  await transport.sendMail(mailOption);
};
module.exports = sendEmail;
