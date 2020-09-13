'use strict'
 
const restendpoint = require('@permian/restendpoint')
 
module.exports = (p, userDb) => {
  const params = Object.assign({
    urlBasePath: 'userdb-static',
    maxConnections: 32,
    port: 30269,
    host: '127.0.0.1',
    requestTimeout: 2000,
    logToStdout: false
  }, p)
  
  const handleSafe = restendpoint.tools.handleSafe
  const getRequestParameter = restendpoint.tools.getRequestParameter
  
  const handlers = restendpoint.prependPathToHandlers(params.urlBasePath, {
    GET: {
      'find': (context, ioaFactory) => userDb.find(getRequestParameter(context, 'usernames').split('~'), 
                                                   data => handleSafe(context, ioaFactory, writer => writer.flushObjectArray(data))),
      'find-like': (context, ioaFactory) => userDb.findLike(getRequestParameter(context, 'username-matcher'), 
                                                            data => handleSafe(context, ioaFactory, writer => writer.flushObjectArray(data))),
      'find-group': (context, ioaFactory) => userDb.findGroup(getRequestParameter(context, 'groupname'), 
                                                              data => handleSafe(context, ioaFactory, writer => writer.flushObjectArray(data)))
    }
  })
  
  return restendpoint.startInstance(handlers, params)
}
 
