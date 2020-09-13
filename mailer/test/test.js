'use strict'

const assert = require('assert')
const Mailer = require('..')

const transportOpts = {
  host: 'mailbox1.caesar.elte.hu',
  secure: true,
  port: 465,
  username: 'hidega',
  password: 'steyr1895' 
}

const mailOpts = {
  from: '"Andras Hideg" <hidega@caesar.elte.hu>',
  to: 'a.hideg@chello.hu',
  subject: 'Hello', 
  text: 'Hello world!'
}

Mailer.sendmail(transportOpts, mailOpts, err => {
  err && console.error(err)
  assert(!err)
  console.log('OK')
})
