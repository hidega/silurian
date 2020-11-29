'use strict'
 
var RestEndpoint = require('@permian/restendpoint')
var parseParams = require('./parse-params') 
var StaticUserDatabase = require('./static-userdb')

function RestEndpoint() {}

RestEndpoint.USER_DELIMITER = ','

var flushResult = (contextFactory, result) => RestEndpoint.tools.responseJsonObject(contextFactory, RestEndpoint.tools.STATUS_OK, result)

RestEndpoint.start = (params, userDb) => {
  params = parseParams(params)

  var database = new StaticUserDatabase(params.userdb.database || {})
    
  var handlers = RestEndpoint.prependPathToHandlers(params.userdb.urlBasePath, {
    GET: {
      'ping': (parameters, contextFactory) => RestEndpoint.tools.responseJsonOk(contextFactory),
      'find': (parameters, contextFactory) => {
        var result = { furulya: 1 }
        return flushResult(contextFactory, result)
      },
      'find-like': (parameters, contextFactory) => {
        var result = { furulya: 1 }
        return flushResult(contextFactory, result)
      },
      'find-group': (parameters, contextFactory) => {
        var result = database.findGroup(parameters.getRequestParameters().group)
        return flushResult(contextFactory, result)
      }
    }
  })
  
  return RestEndpoint.startInstance(handlers, params.restEndpoint)
}
 
module.exports = Object.freeze(RestEndpoint)
