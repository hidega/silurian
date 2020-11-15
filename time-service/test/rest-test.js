'use strict'

var assert = require('assert')
var timeService = require('../src')

timeService.Endpoint.start({ 
  restEndpoint: { 
    logToStdout: true 
  }
})

var client = new timeService.RestClient({ refreshFrequencySec: 20 })

setInterval(() => {
  client.getTime().then(t => console.log('time:', t.data, 'diff:', Number(t.data.result) - Number(client.getStoredTime()))).catch(err => assert(!err))
  client.getSequenceNr().then(t => console.log('seq:', t.data)).catch(err => assert(!err))
  console.log('stored time', client.getStoredTime())
}, 2000)
