'use strict'

const cfg = require('./cfg')
const {MariaDbManager} = require('../src')

const manager = new MariaDbManager(cfg)

manager.restart().then(() => console.log('OK')).catch(err => console.log('NOT OK\n', err))
