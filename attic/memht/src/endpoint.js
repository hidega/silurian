'use strict'

const RestEndpoint = require('@permian/RestEndpoint')
const {Hashtable} = require('@permian/science')
const {lang} = require('@permian/commons')
const Handlers = require('./handlers')

function Endpoint () {}

Endpoint.start = p => {
  const params = lang.assignRecursive({
    restEndpoint: {
      urlBasePath: 'memht',
      maxConnections: 32,
      port: 15669,
      host: '127.0.0.1',
      requestTimeout: 5*1000,
      logToStdout: false
    }
  }, p)

  const hashtable = new Hashtable(params.hashtable)

  const handlers = new Handlers(hashtable)

  const handleSafe = RestEndpoint.tools.handleSafe

  const getRequestParameter = RestEndpoint.tools.getRequestParameter

  const reqHandlers = RestEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'keys-like': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushArray(hashtable.keysLike(getRequestParameter(context, 'keyprefix')))),
      'diagnostics': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushObject('diagnostics', hashtable.diagnostics())),
      'get-raw': (context, ioaFactory) => handlers.getRaw(context, ioaFactory),
      'get-objects': (context, ioaFactory) => handlers.getObjects(context, ioaFactory),
      'has': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushResult(hashtable.has(getRequestParameter(context, 'key'))))
    },
    PUT: {
      'put-objects': (context, ioaFactory) => handlers.putObjects(context, ioaFactory),
      'put-raw': (context, ioaFactory) => handlers.putRaw(context, ioaFactory)
    },
    DELETE: {
      'remove-like': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushResult(!!hashtable.removeLike(getRequestParameter(context, 'keyprefix')))),
      'remove': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushResult(!!hashtable.remove(getRequestParameter(context, 'key'))))
    }
  })

  const shutdown = RestEndpoint.startInstance(reqHandlers, params.restEndpoint)

  return ({
    stop: () => {
      shutdown()
      hashtable.dispose()
    },
    getHashtable: () => hashtable
  })
}

module.exports = Object.freeze(Endpoint)
