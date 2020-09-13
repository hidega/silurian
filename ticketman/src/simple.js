'use strict'

const {lang} = require('@permian/commons')
const BaseTicketManager = require('./basetm')

function SimpleTicketManager(p) {
  const self = this

  const obtainTicket = (userId, appContext, expiresEpoch, callback) => {
    try {
      self.checkObtainParameters(userId, appContext, expiresEpoch)
      const salt = self.generateSalt()
      const rawTicket = salt + self.params.separator + userId + self.params.separator + (appContext || 'app') + self.params.separator + expiresEpoch
      callback(false, self.encode(Buffer.from(rawTicket)))
    } catch(e) {
      callback(e)
    }
  }

  const decodeTicket = (ticket, callback) => {
    try {
      const [, userId, appContext, expiresEpoch] = self.decode(ticket).toString().split(self.params.separator)
      callback(false, { userId, appContext, expiresEpoch: Number(expiresEpoch) })
    } catch(e) {
      callback(e)
    }
  }

  BaseTicketManager.call(self, p)
  
  self.obtainTicket = lang.promisifyIfNoCallback3(obtainTicket)
  
  self.decodeTicket = lang.promisifyIfNoCallback1(decodeTicket)
}

module.exports = SimpleTicketManager
