const { text } = require('express')
const nodeMailer = require('nodemailer')

const sendEmail = async (option) => {
  const transpoter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    log: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const emailOptions = {
    from: 'anuflix_support<support@anuflix.org>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  }

  await transpoter.sendMail(emailOptions)
}

module.exports = sendEmail
