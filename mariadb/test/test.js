'use strict'

const path = require('path') 
const assert = require('assert') 
const commons = require('@permian/commons')
const ping = require('../src/ping')
const purge = require('../src/purge')
const restart = require('../src/restart')
const healthcheck = require('../src/healthcheck')
const init = require('../src/init') 
const fs = commons.files.fsExtra

const randomId = () => '' + Date.now() + Math.floor(Math.random()*100000)

const createConfiguration = () => {
  const appDir = './tmpdir3-' + randomId() + tmpSuffix
  const prgDir = appDir
  const dataDir = './tmpdatadir5-' + randomId() + tmpSuffix
  const cfg = {
    restartDelayMs: 200,
    host: '127.0.0.1',
    port: '3306',
    dataDir: dataDir,
    prgDir: prgDir,
    configFilePath: path.resolve(prgDir, 'mariadb.cnf'),
    appBinDir: path.resolve(prgDir, 'bin'),
    pidFilePath: path.resolve(prgDir, 'server.pid'),
    uid: Number(commons.getUid(CmdAdapter.Constants.MYSQL)),
    gid: Number(commons.getGid(CmdAdapter.Constants.MYSQL)),
    defaultHostname: CmdAdapter.Constants.LOCALHOST, // egyelore NE legyen mas!
    superuserName: CmdAdapter.Constants.ROOT, // NE legyen mas!
    superuserPwd: 'rootpwd',
    secondaryUserName: CmdAdapter.Constants.MYSQL, // NE legyen mas!
    secondaryUserPwd: 'mysqlpwd',
    log: {
      dir: dataDir,
      logBinFileMaxSizeMB: 100,
      logBinExpireLogsDays: 1,
      errorLogfile: path.resolve(appDir, 'mariadb_error.log'),
      logErrorVerbosity: 3, 
      logBin: 'OFF',
      generalLogFile: 'mariadb_general.log',
      logOutput: 1
    }
  }
  return cfg
}

casePing()
.then(() => casePurge())
.then(() => caseRestart())
.then(() => caseHealthcheck())
.then(() => caseInit())
.then(() => console.log('\n-----------------\nTests are OK :)'))
.catch(err => console.log('ERROR caught : ', err))

