'use strict'

const restendpoint = require('@permian/restendpoint')
const {Queue} = require('@permian/science')
const {lang} = require('@permian/commons')
const Handlers = require('./handlers')

function Service() {}

Service.start = p => {
  const params = lang.assignRecursive({
    restEndpoint: {
      urlBasePath: 'memqueue',
      maxConnections: 32,
      port: 23058,
      host: '127.0.0.1',
      requestTimeout: 5*1000,
      logToStdout: false
    },
    queue: {}
  }, p)

  const queue = new Queue(params.queue)

  const handlers = new Handlers(queue)

  const handleSafe = restendpoint.tools.handleSafe

  const reqHandlers = restendpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'diagnostics': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushObject('diagnostics', queue.diagnostics())),
      'peek-back-object': (context, ioaFactory) => handleSafe(handlers.peekBackObject(context, ioaFactory)),
      'peek-back-raw': (context, ioaFactory) => handleSafe(handlers.peekBackRaw(context, ioaFactory)),
      'peek-front-object': (context, ioaFactory) => handleSafe(handlers.peekFrontObject(context, ioaFactory)),
      'peek-front-raw': (context, ioaFactory) => handleSafe(handlers.peekFrontRaw(context, ioaFactory)),
      'dequeue-raw': (context, ioaFactory) => handleSafe(handlers.dequeueRaw(context, ioaFactory)),
      'dequeue-objects': (context, ioaFactory) => handleSafe(handlers.dequeueObjects(context, ioaFactory))
    },
    PUT: {
      'enqueue-raw': (context, ioaFactory) => handleSafe(handlers.enqueueRaw(context, ioaFactory)),
      'enqueue-objects': (context, ioaFactory) => handleSafe(handlers.enqueueObjects(context, ioaFactory))
    },
    DELETE: {
      'clear': (context, ioaFactory) => handleSafe(context, ioaFactory, writer => writer.flushResult({ ok: !queue.clear() }))
    }
  })

  const shutdown = restendpoint.startInstance(reqHandlers, params.restEndpoint)

  return ({
    stop: () => {
      shutdown()
      queue.dispose()
    },
    getQueue: () => queue
  })
}

module.exports = Service
