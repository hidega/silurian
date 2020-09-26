'use strict'

const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const {MariaDbManager} = require('../src')
const cfg = require('./cfg')

cfg.configFilePath = path.resolve(__dirname, 'mariadb.temp')

const manager = new MariaDbManager(cfg)

manager.dumpConfigFile()
.then(() => fs.readFile(cfg.configFilePath))
.then(buf => assert(buf.length>0))
.then(() => console.log('OK'))
.catch(err => console.log('NOT OK\n', err))
