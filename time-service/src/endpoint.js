'use strict'

var restEndpoint = require('@permian/restendpoint')
var TimeMonitor = require('./time-monitor')
var ping = require('ping')

function Endpoint() {}

Endpoint.ping = ping

Endpoint.start = p => {
  var params = p || {}

  params.timeMonitor = Object.assign({}, p.timeMonitor)

  params.restEndpoint = Object.assign({
    urlBasePath: 'timeservice',
    maxConnections: 32,
    port: 25364,
    host: '127.0.0.1',
    requestTimeoutMs: 5 * 1000,
    logToStdout: false
  }, p.restEndpoint)

  var timeMonitor = new TimeMonitor(params.timeMonitor)

  var handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'ping': (parameters, contextFactory) => restEndpoint.tools.responseJsonOk(contextFactory),
      'seqnr': (parameters, contextFactory) => restEndpoint.tools.responseJsonObject(contextFactory, restEndpoint.tools.STATUS_OK, { uid: timeMonitor.uid(), seq: timeMonitor.seq() }),
      'gettime': (parameters, contextFactory) => restEndpoint.tools.responseJsonObject(contextFactory, restEndpoint.tools.STATUS_OK, timeMonitor.now())
    }
  })

  var stop = restEndpoint.startInstance(handlers, params.restEndpoint)

  return () => {
    stop()
    timeMonitor.dispose()
  }
}

module.exports = Object.freeze(Endpoint)
