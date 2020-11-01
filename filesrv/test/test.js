'use strict'

// http://localhost:5802/web/file-service/list-directory?path=c/c1
// 

var FileServer = require('../src')

var cfg = {
  restEndpoint: {
    urlBasePath: 'web/file-service',
    logToStdout: true
  },
  fileServer: {
    basedir: '/tmp'
  }
}

FileServer.start(cfg)

setInterval(() => FileServer.healthcheck(cfg, err => console.log('ping ' + (err ? 'ERROR: ' + err : 'OK'))), 5000)
