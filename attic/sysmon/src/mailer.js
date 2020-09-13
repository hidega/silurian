'use strict'

const Mailer = require('@silurian/mailer')

function SysmonMailer(logger, mailAccount) {
  const self = this

  const recipient = 'a.hideg@chello.hu'
  const sender = 'hidega@caesar.elte.hu'

  const sendMail = (msg1, msg2, subject) => Mailer.sendMail({
    host: mailAccount.host,
    port: mailAccount.port,
    secure: true,
    username: mailAccount.username,
    password: mailAccount.password
  }, {
    from: sender,
    to: recipient,
    subject: subject + ' on ' + new Date().toISOString(), 
    text: msg1 + '\n' + (msg2 ? JSON.stringify(msg2, null, 2).replace(/[\\\\\\\\,\\\\\\]/g, '\\\\') : '')
  }, err => err && logger.error('Mail error', err))

  self.info = (msg1, msg2) => sendMail(msg1, msg2, 'Info')

  self.error = (msg1, msg2) => sendMail(msg1, msg2, 'ERROR')
}

SysmonMailer.bogusInstance = {
  info: () => {},
  error: () => {}  
}

module.exports = SysmonMailer

