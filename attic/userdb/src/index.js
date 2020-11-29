'use strict'
 
var StaticUserdatabase = require('./static-userdb') 
var ping = require('./ping') 
var RestEndpoint = require('./restendpoint')
var RestClient = require('./rest-client')

module.exports = Object.freeze({ 
  start: RestEndpoint.start, 
  RestClient, 
  StaticUserdatabase, 
  RestEndpoint, 
  ping 
})
