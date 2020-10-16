'use strict'

var commons = require('./commons')
var restEndpoint = require('@permian/restendpoint')
var sendmail = require('./sendmail')

function Endpoint(p) {}

Endpoint.start = p => {
  var params = commons.assignRecursive({
    restEndpoint: {
      urlBasePath: 'mailer',
      maxConnections: 32,
      port: 56631,
      host: '127.0.0.1',
      requestTimeout: 5 * 1000,
      logToStdout: false
    }
  }, p)

  var Writer = restEndpoint.tools.SimpleJsonWriter

  var handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      ping: (context, ioaFactory) => Writer.flushResult(ioaFactory, 'OK')
    },
    POST: {
      send: (context, ioaFactory) => context.getRequestBodyAsObject((err, obj) => commons.matcher()
        .on(err, () => Writer.flushError(ioaFactory, err))
        .otherwise(() => sendmail(obj.transportOpts || params.transportOpts, obj.mailOpts, Writer.flushResult(ioaFactory, 'OK'))))
    }
  })

  return restEndpoint.startInstance(handlers, params.restEndpoint)
}

module.exports = Endpoint
