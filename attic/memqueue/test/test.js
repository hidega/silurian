'use strict'

const memht = require('../src')

memht.Endpoint.start({
  restEndpoint: {
    logToStdout: true
  }
})