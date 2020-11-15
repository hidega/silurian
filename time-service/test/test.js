'use strict'

var ts = require('../src')

var caseMonitor = () => {
  var timeMonitor = new ts.TimeMonitor()  
  var f = () => setTimeout(() => {
    console.log(timeMonitor.now(), Date.now(), timeMonitor.now()-Date.now())
    f()
  }, 10000 - parseInt(Math.random()*5000))
  f()
}

caseMonitor()
