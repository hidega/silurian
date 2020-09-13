'use strict'

const ticketman = require('../src')

ticketman.Endpoint.start({
  restEndpoint: { 
    urlBasePath: '/',
    logToStdout: true
  }
})
