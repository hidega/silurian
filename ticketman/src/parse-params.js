'use strict'

module.exports = p => {
  p || (p = {})
  var params = {}
  params.restEndpoint = Object.assign({
    maxConnections: 32,
    port: 11290,
    host: '127.0.0.1',
    requestTimeoutMs: 5 * 1000,
    logToStdout: false
  }, p.restEndpoint)
  params.ticketManager = Object.assign({
    urlBasePath: 'ticketman',
    instance: false
  }, p.ticketManager)
  return params
}
