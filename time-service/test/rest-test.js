'use strict'

var assert = require('assert')
var timeService = require('../src')

var cfg = { 
  restEndpoint: { 
    logToStdout: true 
  }
}

timeService.Endpoint.start(cfg)

var client = new timeService.RestClient({ refreshFrequencySec: 30 })

setInterval(() => {
  client.getTime()
    .then(t => console.log('time:', t.data, 'diff:', Number(t.data) - Number(client.getStoredTime())))
    .catch(err => console.log(err) || assert(!err)).catch(process.exit)
  client.getSequenceNr()
    .then(t => console.log('seq:', t.data))
    .catch(err => console.log(err) || assert(!err)).catch(process.exit)
  console.log('stored time: ', client.getStoredTime())
}, 2800)

setInterval(() => timeService.Endpoint.ping(cfg, err => console.log(err ? 'ping error: ' + err : ' ping OK')), 5200)

