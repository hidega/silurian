'use strict'

const commons = require('./commons')

module.exports = cmdAdapter => cmdAdapter.pingServer()
  .then(result => result.code === 0 && commons.throwError('Server is running, data will not be deleted.', 9532))
  .then(() => commons.fs.remove(cmdAdapter.getConfiguration().configFilePath))
  .then(() => commons.fs.remove(cmdAdapter.getConfiguration().dataDir))
