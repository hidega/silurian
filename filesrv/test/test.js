'use strict'

const FileServer = require('../src')

FileServer.start({
  restEndpoint: {
    urlBasePath: 'web/file-service',
    logToStdout: true
  }
})
