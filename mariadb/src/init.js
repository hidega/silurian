'use strict'

const mariadbfw = require('@permian/mariadbfw')
const commons = require('./commons')

module.exports = cmdAdapter => {
  const assertOk = r => r.code === 0 || commons.throwError('command failed', 1862)
  const cfg = cmdAdapter.getConfiguration()
  const restartDelayMs = cfg.restartDelayMs || 5000
  return commons.fs.outputFile(cfg.configFilePath, mariadbfw.createConfig(cfg))
    .then(() => cmdAdapter.initializeDatabase())
    .then(assertOk)
    .then(() => cmdAdapter.startServer({
      spawnOpts: { detached: false },
      waitForExit: false
    }))
    .then(() => commons.sleep(restartDelayMs))
    .then(() => cmdAdapter.pingServer())
    .then(assertOk)
    .then(() => cmdAdapter.shutdownServer({ asRoot: true }))
    .then(assertOk)
}
