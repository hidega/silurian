'use strict'

const commons = require('./commons')

module.exports = cmdAdapter => {
  const restartDelayMs = cmdAdapter.getConfiguration().restartDelayMs || 5000
  return cmdAdapter.shutdownServer().catch(() => {})
    .then(() => commons.sleep(restartDelayMs))
    .then(() => cmdAdapter.startServer({
      spawnOpts: { detached: true },
      waitForExit: false
    }))
    .then(() => commons.sleep(restartDelayMs))
    .then(() => cmdAdapter.pingServer())
    .then(r => r.code === 0 || commons.throwError(4389))
}
