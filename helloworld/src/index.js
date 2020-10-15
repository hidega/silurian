'use strict'

var commons = require('@permian/commons')
var hellosrv = require('./hellosrv')

var pidfile = '/tmp/helloworld.pid'
var pingTimeoutMs = 2000

var HelloWorld = {
  pidfile,
  pingTimeoutMs,
  start: (cfg, callback) => {
    try {
      commons.files.dumpPidToFile(pidfile)
      hellosrv(cfg)
      callback && callback(0)
    } catch (e) {
      callback ? callback(1) : commons.lang.throwError(e)
    }
  },
  ping: (cfg, cb) => {
    var msg = `${cfg.host}:${cfg.port} is not reachable.`
    var callback = cb || (() => {})
    if (cfg.socket) {
      commons.net.checkIfSocketIsReachable(cfg.socket, pingTimeoutMs, err => callback(err ? msg : false))
    } else {
      commons.net.checkIfPortIsReachable(cfg.host, cfg.port, pingTimeoutMs, err => callback(err ? msg : false))
    }
  }
}

module.exports = Object.freeze(HelloWorld)
