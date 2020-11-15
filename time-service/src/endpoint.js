'use strict'

var restEndpoint = require('@permian/restendpoint')
var TimeMonitor = require('./time-monitor')
var ping = require('./ping')
var parseCfg = require('./parse-cfg')

function Endpoint() {}

Endpoint.ping = ping

Endpoint.start = p => {
  var params = parseCfg(p)

  var timeMonitor = new TimeMonitor(params.timeMonitor)

  var handlers = restEndpoint.prependPathToHandlers(params.timeMonitor.urlBasePath, {
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
