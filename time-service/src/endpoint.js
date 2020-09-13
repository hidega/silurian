'use strict'

const commons = require('@permian/commons')
const restEndpoint = require('@permian/restendpoint')
const TimeMonitor = require('./time-monitor')

function Endpoint(p) {}

Endpoint.start = p => {
  const params = commons.lang.assignRecursive({
    restEndpoint: {
      urlBasePath: 'timeservice',
      maxConnections: 32,
      port: 25364,
      host: '127.0.0.1',
      requestTimeout: 5*1000,
      logToStdout: false
    },
    timeMonitor: {}
  }, p)

  const timeMonitor = new TimeMonitor(params.timeMonitor)

  const handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'seqnr': (context, ioaFactory) => restEndpoint.tools.SimpleJsonWriter.flushResult(ioaFactory, timeMonitor.seq()),
      'gettime': (context, ioaFactory) => restEndpoint.tools.SimpleJsonWriter.flushResult(ioaFactory, timeMonitor.now())
    }
  })

  const stop = restEndpoint.startInstance(handlers, params.restEndpoint)

  return () => {
    stop()
    timeMonitor.dispose()
  }
}

module.exports = Endpoint
