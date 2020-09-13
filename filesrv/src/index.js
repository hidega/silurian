'use strict'

const Server = require('@permian/restendpoint')
const { lang } = require('@permian/commons')
const createGetFileHandler = require('./get-file')
const createListDirectoryHandler = require('./list-directory')
const RestClient = require('./rest-client')

function FileServer() {}

FileServer.start = p => {
  const params = lang.assignRecursive({
    restEndpoint: {
      urlBasePath: 'file-service',
      maxConnections: 32,
      port: 5802,
      host: '127.0.0.1',
      requestTimeout: 20 * 1000,
      logToStdout: false
    },
    fileServer: {
      pathTranslator: p => p,
      additionalTypeMappings: {},
      allowDirectoryListing: true
    }
  }, p)

  const handlers = Server.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'get-file': (context, ioaFactory) => createGetFileHandler(context, ioaFactory, params.fileServer).handle(),
      'list-directory': (context, ioaFactory) => createListDirectoryHandler(context, ioaFactory, params.fileServer).handle()
    }
  })

  return Server.startInstance(handlers, params.restEndpoint)
}

FileServer.RestClient = RestClient

module.exports = Object.freeze(FileServer)
