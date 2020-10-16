'use strict'

var { lang } = require('@permian/commons')
var sendmail = require('./sendmail')

function Sender(to) {
  var transportOpts = Object.assign({
    secure: true,
    port: 465
  }, to)

  var send = (mailOpts, callback) => sendmail(transportOpts, mailOpts, callback)

  this.send = lang.promisifyIfNoCallback2(send)
}

module.exports = Sender
