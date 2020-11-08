'use strict'

// http://localhost:5802/web/file-service/list-directory?path=c/c1
// http://localhost:5802/web/file-service/list-directory/c/c1

var path = require('path')
var filesrv = require('../src')

var cfg = {
  restEndpoint: {
    urlBasePath: 'web/file-service',
    logToStdout: true
  },
  fileServer: {
    allowDirectoryListing: true,
    baseDir: path.resolve(__dirname, '../files')
  }
}

filesrv.FileServer.start(cfg)

//setInterval(() => FileServer.healthcheck(cfg, err => console.log('ping ' + (err ? 'ERROR: ' + err : 'OK'))), 5000)
