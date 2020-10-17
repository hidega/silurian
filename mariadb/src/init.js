'use strict'

var mariadbfw = require('@permian/mariadbfw')
var commons = require('./commons')

module.exports = cmdAdapter => {
  var assertOk = (r, err) => r.code === 0 || commons.throwError('command failed', err)
  var cfg = cmdAdapter.getConfiguration()
  var restartDelayMs = cfg.restartDelayMs || 5000
  return cmdAdapter.pingServer()
    .then(result => result.code === 0 && commons.throwError('The server is running.', 9263))
    .then(() => commons.fs.outputFile(cfg.configFilePath, mariadbfw.createConfig(cfg)))
    .then(() => commons.fs.remove(cfg.dataDir))
    .then(() => commons.fs.ensureDir(cfg.dataDir))
    .then(() => cmdAdapter.initializeDatabase())
    .then(r => assertOk(r, 1288))
    .then(() => cmdAdapter.mariadbd([], {
      spawnOpts: { detached: true },
      waitForExit: false
    }))
    .then(() => commons.sleep(restartDelayMs))
    .then(() => cmdAdapter.pingServer())
    .then(r => assertOk(r, 7432))
    .then(() => cmdAdapter.mariadb([
      '--user=' + cfg.mysqlUserName,
      '-e',
      `set password for ${mariadbfw.Tools.fullUsername(cfg.mysqlUserName, cfg.defaultHostname)} = password('${cfg.mysqlUserPwd}')`
    ]))
    .then(r => assertOk(r, 6439))
}
