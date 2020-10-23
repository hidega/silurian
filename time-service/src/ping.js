'use strict'

var commons = require('@permian/commons')

module.exports = (cfg, callback) => {
  var msg = `${cfg.host}:${cfg.port} is not reachable.`
  var pingTimeoutMs = 10000
  commons.net.checkIfPortIsReachable(cfg.host, cfg.port, pingTimeoutMs, err => callback(err ? msg : false))
}
