'use strict'

var restEndpoint = require('@permian/restendpoint')
var handleGetFile = require('./get-file')
var handleListDirectory = require('./list-directory')
var ping = require('./healthcheck')
var parseParameters = require('./parse-parameters')
var extractPath = require('./extract-path')

var isZipped = (parameters) => reqParams.zipped && (reqParams.zipped === '1' || reqParams.zipped === 'true' || reqParams.zipped === 'yes')

function FileServer() {}

FileServer.start = p => {
  var params = parseParameters(p)

  var handlers = restEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'ping': (parameters, contextFactory) => restEndpoint.tools.responseJsonOk(contextFactory),
      //'get-file': (parameters, contextFactory) => handleGetFile(contextFactory, extractPath(parameters), isZipped(parameters.getRequestParameters())),
      'list-directory': (parameters, contextFactory) => {
        var path = extractPath(parameters, params.fileServer.baseDir, params.fileServer.pathTranslator)
        handleListDirectory(contextFactory.emptyToBuffer(), path, params.fileServer.allowDirectoryListing)
      }
    }
  })

  return restEndpoint.startInstance(handlers, params.restEndpoint)
}

FileServer.ping = ping

FileServer.ZIP_IMPLEMENTATION = 'gzip'

module.exports = Object.freeze(FileServer)
