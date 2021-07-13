'use strict'

var ts = require('../src')

var caseMonitor = () => {
  var timeMonitor = new ts.TimeMonitor({ acceptedDeviationSec: -1, pollIntervalMins: 0.33 })  
  var f = () => setTimeout(() => {
    console.log('tm:', timeMonitor.now(), ', date:', Date.now(), ', delta:', timeMonitor.now() - Date.now())
    f()
  }, 10000 - parseInt(Math.random()*5000))
  f()
}

caseMonitor()
