'use strict'

const { CmdAdapter } = require('@permian/mariadbfw')
const commons = require('./commons')

module.exports = cfg => {
  const appDir = '/opt/prg/mariadb'
  const prgDir = appDir + '/prg'
  const dataDir = '/opt/data/mariadb'
  const defaultCfg = {
    host: '127.0.0.1',
    port: '13306',
    dataDir,
    prgDir,
    configFilePath: commons.resolvePath(prgDir, 'etc', 'mariadb.cnf'),
    appBinDir: commons.resolvePath(prgDir, 'bin'),
    pidFilePath: commons.resolvePath(dataDir, 'server.pid'),
    uid: Number(commons.getUid(CmdAdapter.Constants.MYSQL)),
    gid: Number(commons.getGid(CmdAdapter.Constants.MYSQL)),
    defaultHostname: CmdAdapter.Constants.LOCALHOST, // egyelore NE legyen mas!
    superuserName: CmdAdapter.Constants.ROOT, // NE legyen mas!
    superuserPwd: 'rootpwd',
    secondaryUserName: CmdAdapter.Constants.MYSQL, // NE legyen mas!
    secondaryUserPwd: 'mysqlpwd',
    log: {
      dir: dataDir,
      logBinExpireLogsDays: 2,
      errorLogfile: commons.resolvePath(dataDir, 'mariadb_error.log'),
      logErrorVerbosity: 3,
      logBin: 'OFF',
      generalLogFile: commons.resolvePath(dataDir, 'mariadb_general.log'),
      logOutput: 1
    },
    ssl: {
      acceptUnauthorized: true,
      serverCaFile: '/opt/prg/mariadb/cert/ca-cert.pem',
      serverCertFile: '/opt/prg/mariadb/cert/server-cert.pem',
      serverKeyFile: '/opt/prg/mariadb/cert/server-key.pem'
    },
    healthcheck: {
      database: 'test'
    },
    allowedClientHosts: []
  }
  return commons.assignRecursive(defaultCfg, cfg)
}
