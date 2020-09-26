'use strict'

const path = require('path')
const commons = require('../src/commons')
const {CommandAdapter} = require('@permian/mariadbfw')

const prgDir = '/opt/prg/mariadb' 
const dataDir = '/opt/data/mariadb'

const cfg = {
  restartDelayMs: 5000,
  host: '127.0.0.1',
  port: '3306',
  dataDir,
  prgDir,
  configFilePath: path.resolve(prgDir, 'etc', 'mariadb.cnf'),
  appBinDir: path.resolve(prgDir, 'bin'),
  pidFilePath: path.resolve(dataDir, 'server.pid'),
  uid: Number(commons.getUid(CommandAdapter.Constants.MYSQL)),
  gid: Number(commons.getGid(CommandAdapter.Constants.MYSQL)),
  defaultHostname: CommandAdapter.Constants.LOCALHOST, // egyelore NE legyen mas!
  superuserName: CommandAdapter.Constants.ROOT, // NE legyen mas!
  superuserPwd: 'rootpwd',
  mysqlUserName: CommandAdapter.Constants.MYSQL, // NE legyen mas!
  mysqlUserPwd: 'mysqlpwd',
  ssl: {
    acceptUnauthorized: true,
    serverCaFile: path.resolve(prgDir, 'cert', 'ca-cert.pem'),
    serverCertFile: path.resolve(prgDir, 'cert', 'server-cert.pem'),
    serverKeyFile: path.resolve(prgDir, 'cert', 'server-key.pem')
  },
  log: {
    dir: dataDir,
    logBinFileMaxSizeMB: 100,
    logBinExpireLogsDays: 1,
    errorLogfile: path.resolve(dataDir, 'mariadb_error.log'),
    logErrorVerbosity: 3, 
    logBin: 'bin_log',
    generalLogFile: 'mariadb_general.log',
    logOutput: 1
  }
}

module.exports = cfg

