'use strict'

const { throwError } = require('./commons')

module.exports = cmdAdapter => cmdAdapter.shutdownServer()
  .then(result => result.code === 0 || throwError('could not shutdown', 6711))
