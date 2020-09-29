'use strict'

const nodemailer = require('nodemailer')
const { lang } = require('@permian/commons')

module.exports = (transportOpts, mailOpts, callback) => {
  const isntString = lang.isntString

  try {
    if (isntString(transportOpts.host) ||
      isntString(transportOpts.username) ||
      isntString(transportOpts.password) ||
      isntString(mailOpts.from) ||
      isntString(mailOpts.to)) {
      lang.throwError('Bad mail options')
    }

    const transportOptions = {
      host: transportOpts.host,
      port: transportOpts.port || 465,
      secure: true,
      auth: {
        user: transportOpts.username,
        pass: transportOpts.password
      }
    }
    const mailOptions = {
      from: mailOpts.from,
      to: mailOpts.to,
      subject: mailOpts.subject || 'None',
      text: mailOpts.text || ''
    }
    nodemailer.createTransport(transportOptions).sendMail(mailOptions, callback)
  } catch (e) {
    callback(e)
  }
}
