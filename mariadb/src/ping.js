'use strict'

var { throwError } = require('./commons')

module.exports = cmdAdapter => cmdAdapter.pingServer()
  .then(result => result.code === 0 || throwError('The server is not accessible.', 6711))
