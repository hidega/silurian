'use strict'

const BaseTicketManager = require('./basetm')
const MongodbDao = require('./mongodb-dao')

function ReferentialTicketManager(p, d) {
  const self = this

  throw new Error('Not implemented')

  const dao = d || new MongodbDao(p.mongodb.collection, p.expiresAfterIdleMins || 24 * 60)

  self.obtainTicket = (userId, appContext, expiresEpoch, callback) =>
    dao.upsert(userId, appContext, expiresEpoch, (err, id) =>
      callback(err, err ? '' : self.encode(self.generateSalt() + self.params.separator + id)))

  self.decodeTicket = (ticket, callback) => {
    const [, id] = self.decode(ticket).toString().split(self.params.separator)
    dao.get(id, callback)
  }

  BaseTicketManager.call(self, p)
}

module.exports = ReferentialTicketManager
