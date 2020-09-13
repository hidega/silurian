'use strict'
 
const {lang} = require('@permian/commons')
const sendmail = require('./sendmail')

function Sender(to) {
  const transportOpts = Object.assign({
    secure: true,
    port: 465
  }, to)

  const send = (mailOpts, callback) => sendmail(transportOpts, mailOpts, callback)

  this.send = lang.promisifyIfNoCallback2(send)
}

module.exports = Sender
