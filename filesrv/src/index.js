'use strict'

var Server = require('@permian/restendpoint')
var commons = require('./commons')
var createGetFileHandler = require('./get-file')
var createListDirectoryHandler = require('./list-directory')
var RestClient = require('./rest-client')
var healthcheck = require('./healthcheck')
var parseParameters = require('./parse-parameters')

function FileServer() {}

FileServer.start = p => {
  var params = parseParameters(p)

  var handlers = Server.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'ping': (context, ioaFactory) => Server.tools.SimpleJsonWriter.flushResult(ioaFactory, 'OK'),
      'get-file': (context, ioaFactory) => createGetFileHandler(context, ioaFactory, params.fileServer).handle(),
      'list-directory': (context, ioaFactory) => createListDirectoryHandler(context, ioaFactory, params.fileServer).handle()
    }
  })

  return Server.startInstance(handlers, params.restEndpoint)
}

FileServer.RestClient = RestClient

FileServer.healthcheck = healthcheck

FileServer.ping = healthcheck

FileServer.tools = {
  dumpPidToFile: commons.dumpPidToFile
}

module.exports = Object.freeze(FileServer)
