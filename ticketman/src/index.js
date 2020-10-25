'use strict'

var ReferentialTicketManager = require('./referential')
var SimpleTicketManager = require('./simple')
var MongodbDao = require('./mongodb-dao')
var Endpoint = require('./endpoint')
var RestClient = require('./rest-client')
var ping = require('./ping')

module.exports = {
  ReferentialTicketManager,
  SimpleTicketManager,
  createMongodbDao: MongodbDao.createInstance,
  Endpoint,
  RestClient,
  start: Endpoint.start,
  ping
}
