'use strict'

const path = require('path')
const commons = require('@permian/commons')
const helloworld = require('../src')

const caseHostIp = () => {
  const cfg = {
    pidfile: 'helloworld1.pid',
    port: 12457,
    host: '127.0.0.1'
  }
  helloworld.start(cfg)
  setInterval(() => commons.net.checkIfPortIsReachable('127.0.0.1', 12457, 2000, err => console.log(err ? err : 'host/ip check OK 1')), 9*1000)
  setInterval(() => helloworld.ping(cfg, err => console.log(err ? err : 'host/ip ping OK 2')), 11*1000)
}

const caseSocket = () => {
  const cfg = {
    pidfile: 'helloworld2.pid',
    socket: commons.platform.isLinux() ? '/tmp/testsocket1' : path.join('\\\\?\\pipe', 'valami')
  }
  helloworld.start(cfg)
  setInterval(() => commons.net.checkIfSocketIsReachable(cfg.socket, 2000, err => console.log(err ? err : 'socket check OK 1')), 9*1000)
  setInterval(() => helloworld.ping(cfg, err => console.log(err ? err : 'socket ping OK 2')), 11*1000)
}

caseSocket()
caseHostIp()