'use strict'

const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const {MariaDbManager} = require('../src')
const cfg = require('./cfg')

const manager = new MariaDbManager(cfg)

const testFile = path.resolve(cfg.dataDir, 'test.data')

fs.remove(testFile)
.then(() => fs.ensureDir(cfg.dataDir))
.then(() => fs.writeFile(testFile, 'abc'))
.then(() => manager.purge())
.then(() => fs.pathExists(testFile))
.then(exists => exists ? Promise.reject('data was not deleted') : console.log('OK'))
.catch(err => console.log('NOT OK\n', err))
