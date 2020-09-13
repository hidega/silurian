'use strict'

const ts = require('../src')

const caseMonitor = () => {
  const timeMonitor = new ts.TimeMonitor()  
  const f = () => setTimeout(() => {
    console.log(timeMonitor.now(), Date.now(), timeMonitor.now()-Date.now())
    f()
  }, 10000 - parseInt(Math.random()*5000))
  f()
}

caseMonitor()
