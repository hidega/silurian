'use strict'

const { throwError } = require('@permian/commons')

module.exports = cmdAdapter => cmdAdapter.pingServer()
  .then(res => res === 0 ? cmdAdapter.pingDatabase(cmdAdapter.getConfiguration().healthcheck.database) : throwError('Cannot ping server', 3555))
  .then(res => res === 0 || throwError('Cannot ping database', 6432))
