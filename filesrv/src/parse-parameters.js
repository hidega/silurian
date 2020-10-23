'use strict'

var commons = require('./commons')

module.exports = p => commons.assignRecursive({
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
    basedir: false,
    pathTranslator: p => p,
    additionalTypeMappings: {},
    allowDirectoryListing: true
  }
}, p)
