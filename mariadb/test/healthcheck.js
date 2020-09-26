'use strict'
 
const {MariaDbManager} = require('../src')
const cfg = require('./cfg') 

const manager = new MariaDbManager(cfg)

manager.healthcheck()
.then(() => console.log('OK'))
.catch(err => console.log('NOT OK\n', err))

