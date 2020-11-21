'use strict'

var ticketman = require('../src')

var cfg = {
  restEndpoint: { 
    port: 12340,
    logToStdout: true
  },
  ticketManager: {
    urlBasePath: '/'
  }
}

ticketman.start(cfg)

setInterval(() => ticketman.ping(cfg, err => console.log('Ping ' + (err ? 'error' : 'OK'))), 5000)

//http://127.0.0.1:12340/obtain-ticket?userid=userid&appctx=appctx&expires=160597455552
