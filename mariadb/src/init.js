'use strict'

const mariadbfw = require('@permian/mariadbfw')
const commons = require('./commons')

module.exports = cmdAdapter => {
  const assertOk = (r, err) => r.code === 0 || commons.throwError('command failed', err)
  const cfg = cmdAdapter.getConfiguration()
  const restartDelayMs = cfg.restartDelayMs || 5000
  return commons.fs.outputFile(cfg.configFilePath, mariadbfw.createConfig(cfg))
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
      '--user=' + cfg.superuserName,
      '-e',
      `set password for ${mariadbfw.Tools.fullUsername(cfg.superuserName, cfg.defaultHostname)} = password('${cfg.superuserPwd}')`
    ]))
    .then(r => assertOk(r, 6439))
    .then(() => cmdAdapter.executeStatement({
      user: cfg.superuserName,
      password: cfg.superuserPwd,
      statement: `set password for ${mariadbfw.Tools.fullUsername(cfg.mysqlUserName, cfg.defaultHostname)} = password('${cfg.mysqlUserPwd}');`
    }))
    .then(r => assertOk(r, 5501))
    .then(() => cmdAdapter.shutdownServer())
    .then(r => assertOk(r, 2843))
}
