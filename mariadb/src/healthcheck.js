'use strict'

var { throwError } = require('./commons')
var { fork } = require('child_process')

module.exports = cmdAdapter => {
  var cfg = cmdAdapter.getConfiguration()
  cfg.log.rotateOnHealthcheck && fork('./rotate-logs', JSON.stringify(cfg))
  return cmdAdapter.pingServer()
    .then(res => res === 0 ? cmdAdapter.pingDatabase(cfg.healthcheck.database || 'test') : throwError('Cannot ping server', 3555))
    .then(res => res === 0 || throwError('Cannot ping database', 6432))
}
