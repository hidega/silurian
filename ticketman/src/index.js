'use strict'

const ReferentialTicketManager = require('./referential')
const SimpleTicketManager = require('./simple')
const MongodbDao = require('./mongodb-dao')
const Endpoint = require('./endpoint')
const RestClient = require('./rest-client')

module.exports = {
  ReferentialTicketManager,
  SimpleTicketManager,
  createMongodbDao: MongodbDao.createInstance,
  Endpoint,
  RestClient
}
