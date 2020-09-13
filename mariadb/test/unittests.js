'use strict'

const path = require('path') 
const assert = require('assert') 
const commons = require('@permian/commons')
const ping = require('../src/ping')
const purge = require('../src/purge')
const restart = require('../src/restart')
const healthcheck = require('../src/healthcheck')
const init = require('../src/init') 
const dumpConfigFile = require('../src/dump-config-file') 
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

const tmpSuffix = '.temp'

const throwError = (code, msg) => { 
  const err = new Error()
  err.summary = code + (msg===0 || msg ? ' -- ' + msg : '')
  throw err
}

const cmdAdapterMock = {
  pingServer: () => Promise.resolve({ code: 0 }),
  startServer: () => Promise.resolve({ code: 0 }),
  shutdownServer: () => Promise.resolve({ code: 0 }),
  initializeDatabase: () => Promise.resolve({ code: 0 }),
  pingDatabase: () => Promise.resolve(0)
}

const casePing = () => ping(cmdAdapterMock)
.then(() => {
  cmdAdapterMock.pingServer = () => Promise.resolve({ code: 1 })
  return ping(cmdAdapterMock).catch(() => false).then(r => r && throwError(9236))
})
.then(() => cmdAdapterMock.pingServer = () => Promise.resolve({ code: 0 }))

const casePurge = () => {
  const filename = 'data.txt' + tmpSuffix
  const cfg = { 
    configFilePath: path.resolve('./cfgfile-' + randomId() + tmpSuffix),  
    dataDir: path.resolve('./datadir-' + randomId() + tmpSuffix)
  }
  cmdAdapterMock.getConfiguration = () => cfg
  return fs.ensureDir(cfg.dataDir)
  .then(() => fs.outputFile(path.resolve(cfg.dataDir, filename), '1234567890'))
  .then(() => fs.outputFile(cfg.configFilePath, '1234567890'))
  .then(() => purge(cmdAdapterMock))
  .then(r => r===1 ? fs.pathExists(cfg.configFilePath) : throwError(4557, r))
  .then(exists => exists ? fs.pathExists(cfg.dataDir) : throwError(8545))
  .then(exists => exists || throwError(3998))
  .then(() => cmdAdapterMock.pingServer = () => Promise.resolve({ code: 1 }))
  .then(() => purge(cmdAdapterMock))
  .then(r => r===0 || throwError(1307, r))
  .then(() => cmdAdapterMock.pingServer = () => Promise.resolve({ code: 0 }))
  .then(() => fs.pathExists(cfg.configFilePath))
  .then(exists => exists ? throwError(7896) : fs.pathExists(cfg.dataDir))
  .then(exists => exists && throwError(3247))
}

const caseRestart =() => {
  const cfg = createConfiguration()
  cmdAdapterMock.getConfiguration = () => cfg
  return restart(cmdAdapterMock).then(r => r===0 || throwError(6004, r))
  .then(() => {
    cmdAdapterMock.pingServer = () => Promise.resolve({ code: 1 })
    return restart(cmdAdapterMock)
  })
  .then(r => r===1 || throwError(8831, r))
  .then(() => cmdAdapterMock.pingServer = () => Promise.resolve({ code: 0 }))
}

const caseHealthcheck = () => {
  const cfg = createConfiguration()
  cmdAdapterMock.getConfiguration = () => cfg
  return healthcheck(cmdAdapterMock)
  .then(r => r===0 || throwError(3754, r))
  .then(() => {
    cmdAdapterMock.pingServer = () => Promise.resolve({ code: 1 })
    return healthcheck(cmdAdapterMock)
  })
  .then(r => r===0 && throwError(7430))
  .then(() => {
    cmdAdapterMock.pingServer = () => Promise.resolve({ code: 0 })
    cmdAdapterMock.pingDatabase = () => Promise.resolve(1)
    return healthcheck(cmdAdapterMock)
  })
  .then(r => {
    r===0 && throwError(5544)
    cmdAdapterMock.pingDatabase = () => Promise.resolve(0)
  })
}

const caseInit = () => {
  const cfg = createConfiguration()
  cmdAdapterMock.getConfiguration = () => cfg
  return init(cmdAdapterMock)
  .then(r => r===0 || throwError(9320, r))
}

const caseDumpConfigFile = () => {
  const cfg = createConfiguration()
  cmdAdapterMock.getConfiguration = () => cfg
  return fs.ensureDir(cfg.prgDir)
  .then(() => dumpConfigFile(cmdAdapterMock))
  .then(r => r===0 || throwError(7655, r))
  .then(() => fs.pathExists(cfg.configFilePath))
  .then(exists => exists || throwError(4369))
  .then(() => fs.readFile(cfg.configFilePath))
  .then(f => console.log('\n' + f.toString()))
}

casePing()
.then(() => casePurge())
.then(() => caseRestart())
.then(() => caseHealthcheck())
.then(() => caseInit())
.then(() => caseDumpConfigFile())
.then(() => console.log('\n-----------------\nTests are OK :)'))
.catch(err => console.log('ERROR caught : ', err))
.finally(() => commons.files.deleteDirContents('.', () => {}, `*${tmpSuffix}`))

