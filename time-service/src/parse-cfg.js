'use strict'

module.exports = p => {
  var params = p || {}

  params.timeMonitor = Object.assign({ urlBasePath: 'timeservice' }, p.timeMonitor)

  params.restEndpoint = Object.assign({
    maxConnections: 32,
    port: 25364,
    host: '127.0.0.1',
    requestTimeoutMs: 5 * 1000,
    logToStdout: false
  }, p.restEndpoint)

  return params
}
