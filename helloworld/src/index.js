'use strict'

const commons = require('@permian/commons')
const hellosrv = require('./hellosrv')

const pidfile = '/tmp/helloworld.pid'
const pingTimeoutMs = 2000

const HelloWorld = {
  pidfile,
  pingTimeoutMs,
  start: (cfg, callback) => {
    commons.files.dumpPidToFile(pidfile)
    try {
      hellosrv(cfg)
      callback && callback(0)
    } catch (e) {
      callback ? callback(1) : commons.lang.throwError(e)
    }
  },
  ping: (cfg, cb) => {
    const callback = cb || (() => {})
    if (cfg.socket) {
      commons.net.checkIfSocketIsReachable(cfg.socket, pingTimeoutMs, err => callback(err ? `${cfg.host}:${cfg.port} is not reachable.` : false))
    } else {
      commons.net.checkIfPortIsReachable(cfg.host, cfg.port, pingTimeoutMs, err => callback(err ? `${cfg.host}:${cfg.port} is not reachable.` : false))
    }
  }
}

module.exports = Object.freeze(HelloWorld)
