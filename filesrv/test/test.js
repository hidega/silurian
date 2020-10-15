'use strict'

// http://localhost:5802/web/file-service/list-directory?path=c/c1
// 

var FileServer = require('../src')

FileServer.start({
  restEndpoint: {
    urlBasePath: 'web/file-service',
    logToStdout: true
  }
})
