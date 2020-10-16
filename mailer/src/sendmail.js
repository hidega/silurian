'use strict'

var nodemailer = require('nodemailer')
var commons = require('./commons')

module.exports = (transportOpts, mailOpts, callback) => {
  if (commons.isntString(transportOpts.host) ||
    commons.isntString(transportOpts.username) ||
    commons.isntString(transportOpts.password) ||
    commons.isntString(mailOpts.from) ||
    commons.isntString(mailOpts.to)) {
    callback('Bad mail options')
  } else {
    var transportOptions = {
      host: transportOpts.host,
      port: transportOpts.port || 465,
      secure: true,
      auth: {
        user: transportOpts.username,
        pass: transportOpts.password
      }
    }
    var mailOptions = {
      from: mailOpts.from,
      to: mailOpts.to,
      subject: mailOpts.subject || 'None',
      text: mailOpts.text || ''
    }
    nodemailer.createTransport(transportOptions).sendMail(mailOptions, callback)
  }
}
