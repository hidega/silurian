'use strict'

const commons = require('@permian/commons')
const httpredirector = require('../src')

const cfg = {
  pidfile: './httpredirector.pid',
  port: 8080,
  ip: '127.0.0.1',
  newLocation: 'http://www.google.com/'
}

const caseDefault = () => {
  httpredirector.start(cfg, console.log)
  setInterval(() => httpredirector.ping(cfg, err => {
    if(err) {
      console.log('ERROR: ' + err)
      commons.proc.terminateProcess(1)
    }
    console.log('10 sec test OK')
  }), 10*1000)
}

caseDefault()

