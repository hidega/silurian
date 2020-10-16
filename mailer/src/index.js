'use strict'

var sendmail = require('./sendmail')
var Endpoint = require('./endpoint')
var RestClient = require('./rest-client')
var Sender = require('./sender')

module.exports = Object.freeze({ sendmail, Endpoint, RestClient, Sender })
