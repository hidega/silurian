'use strict'

var BaseTicketManager = require('./basetm')

function SimpleTicketManager(p) {
  this.obtainTicket = (userId, appContext, expiresEpoch, callback) => {
    try {
      this.checkObtainParameters(userId, appContext, expiresEpoch)
      var salt = this.generateSalt()
      var rawTicket = salt + this.params.separator + userId + this.params.separator + (appContext || 'app') + this.params.separator + expiresEpoch
      return this.resolve(this.encode(Buffer.from(rawTicket)), callback)
    } catch (e) {
      return this.reject(e, callback)
    }
  }

  this.decodeTicket = (ticket, callback) => {
    try {
      var [, userId, appContext, expiresEpoch] = this.decode(ticket).toString().split(this.params.separator)
      return this.resolve({ userId, appContext, expiresEpoch: Number(expiresEpoch) }, callback)
    } catch (e) {
      return this.reject(e, callback)
    }
  }

  BaseTicketManager.call(this, p)
}

module.exports = SimpleTicketManager
