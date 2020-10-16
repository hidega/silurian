'use strict'

var restEndpoint = require('@permian/restendpoint')
var TimeMonitor = require('./time-monitor')

function Endpoint(p) {}

Endpoint.start = p => {
  var params = p || {}

  params.timeMonitor = Object.assign({}, p.timeMonitor)

  params.restEndpoint = Object.assign({
    urlBasePath: 'timeservice',
    maxConnections: 32,
    port: 25364,
    host: '127.0.0.1',
    requestTimeout: 5 * 1000,
    logToStdout: false
  }, p.restEndpoint)

  var timeMonitor = new TimeMonitor(params.timeMonitor)

  var handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'seqnr': (context, ioaFactory) => restEndpoint.tools.SimpleJsonWriter.flushResult(ioaFactory, timeMonitor.seq()),
      'gettime': (context, ioaFactory) => restEndpoint.tools.SimpleJsonWriter.flushResult(ioaFactory, timeMonitor.now())
    }
  })

  var stop = restEndpoint.startInstance(handlers, params.restEndpoint)

  return () => {
    stop()
    timeMonitor.dispose()
  }
}

module.exports = Endpoint
