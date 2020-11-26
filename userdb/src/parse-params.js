'use strict'

module.exports = p => {
  var params = p || {}

  params.userdb = Object.assign({ 
    urlBasePath: 'userdb',
    extended: false,
    dbFile: false,
    database: false
  }, p.userdb)

  params.restEndpoint = Object.assign({
    maxConnections: 32,
    port: 30269,
    host: '127.0.0.1',
    requestTimeoutMs: 2000,
    logToStdout: false
  }, p)

  return params
}
