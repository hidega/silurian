'use strict'

const sendmail = require('./sendmail')
const Endpoint = require('./endpoint')
const RestClient = require('./rest-client')
const Sender = require('./sender')

module.exports = Object.freeze({ sendmail, Endpoint, RestClient, Sender })
