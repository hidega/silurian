'use strict'

const commons = require('@permian/commons')
const restEndpoint = require('@permian/restendpoint')
const sendmail = require('./sendmail')

function Endpoint(p) {}

Endpoint.start = p => {
  const params = commons.lang.assignRecursive({
    restEndpoint: { 
      urlBasePath: 'mailer',
      maxConnections: 32,
      port: 56631,
      host: '127.0.0.1',
      requestTimeout: 5*1000,
      logToStdout: false
    }
  }, p)

  const Writer = restEndpoint.tools.SimpleJsonWriter

  const handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      ping: (context, ioaFactory) => Writer.flushResult(ioaFactory, 'OK')
    },
    POST: {
      send: (context, ioaFactory) => context.getRequestBodyAsObject((err, obj) => {
        if(err) {
          Writer.flushError(ioaFactory, err)
        } else {
          sendmail(obj.transportOpts || params.transportOpts, obj.mailOpts, Writer.flushResult(ioaFactory, 'OK'))
        }
      })
    }
  }) 

  return restEndpoint.startInstance(handlers, params.restEndpoint)
}

module.exports = Endpoint
