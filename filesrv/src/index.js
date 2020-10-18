'use strict'

var Server = require('@permian/restendpoint')
var commons = require('./commons')
var createGetFileHandler = require('./get-file')
var createListDirectoryHandler = require('./list-directory')
var RestClient = require('./rest-client')

function FileServer() {}

FileServer.start = p => {
  var params = commons.assignRecursive({
    restEndpoint: {
      urlBasePath: 'file-service',
      maxConnections: 32,
      port: 5802,
      host: '127.0.0.1',
      id: '1',
      requestTimeout: 20 * 1000,
      logToStdout: false
    },
    fileServer: {
      pathTranslator: p => p,
      additionalTypeMappings: {},
      allowDirectoryListing: true
    }
  }, p)

  var handlers = Server.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'get-file': (context, ioaFactory) => createGetFileHandler(context, ioaFactory, params.fileServer).handle(),
      'list-directory': (context, ioaFactory) => createListDirectoryHandler(context, ioaFactory, params.fileServer).handle()
    }
  })

  return Server.startInstance(handlers, params.restEndpoint)
}

FileServer.RestClient = RestClient

FileServer.tools = {
  dumpPidToFile: commons.dumpPidToFile
}

module.exports = Object.freeze(FileServer)
