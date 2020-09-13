'use strict'

const restendpoint = require('@permian/restendpoint')
const {lang} = require('@permian/commons')
const InMemoryCounters = require('./inmemory')
const startMongoDbCounters = require('./start-mongodb-ctr')

function Endpoint () {}

Endpoint.start = (p, callback) => {
  const params = lang.assignRecursive({
    restEndpoint: {
      urlBasePath: 'counters',
      maxConnections: 32,
      port: 30297,
      host: '127.0.0.1',
      requestTimeout: 5*1000,
      logToStdout: false
    }
  }, p)

  const start = counters => {
    const getRequestParameter = restendpoint.tools.getRequestParameter
    const flushResult = restendpoint.tools.flushResult
    const flushError = restendpoint.tools.flushError

    const reqHandlers = restendpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
      GET: {
        'get': (context, ioaFactory) => counters.get(getRequestParameter(context, 'name'),
                                                     (err, result) => err ? flushError(ioaFactory, err) : flushResult(ioaFactory, result)),
        'increment-and-get': (context, ioaFactory) => counters.incrementAndGet(getRequestParameter(context, 'name'),
                                                                               getRequestParameter(context, 'val'),
                                                                               (err, result) => err ? flushError(ioaFactory, err) : flushResult(ioaFactory, result))
      },
      PUT: {
        'increment': (context, ioaFactory) => counters.increment(getRequestParameter(context, 'name'),
                                                                 getRequestParameter(context, 'val'),
                                                                 err => err ? flushError(ioaFactory, err) : flushResult(ioaFactory, 'OK'))
      },
      DELETE: {
        'reset': (context, ioaFactory) => counters.reset(getRequestParameter(context, 'name'),
                                                         err => err ? flushError(ioaFactory, err) : flushResult(ioaFactory, 'OK'))
      }
    })

    const shutdown = restendpoint.startInstance(reqHandlers, params.restEndpoint)

    callback({
      counters,
      stop: () => {
        shutdown()
        counters.dispose()
      }
    })
  }

  params.mongodb ? startMongoDbCounters({ mongodb: params.mongodb }, (err, counters) => err ? callback(err) : start(counters)) : start(new InMemoryCounters())
}

module.exports = Object.freeze(Endpoint)
