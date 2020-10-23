'use strict'

var TimeMonitor = require('./time-monitor')
var Endpoint = require('./endpoint')
var RestClient = require('./rest-client')
var ping = require('ping')

module.exports = Object.freeze({
  Endpoint,
  RestClient,
  TimeMonitor,
  start: Endpoint.start,
  ping
})
