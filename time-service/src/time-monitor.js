'use strict'

var Sntp = require('@hapi/sntp')

function TimeMonitor(params) {
  var parameters = Object.assign({
    servers: [
      { host: 'time.kfki.hu', port: 123 },
      { host: 'a.time.steadfast.net', port: 123 }
    ],
    pollIntervalMins: 10,
    tryServerTimes: 2
  }, params)

  var uid = parseInt((Date.now() / 1000000) % 1000) + 1000 * (parseInt(Math.random() * 8999999) + 1000000)
  var seqNr = BigInt(0)
  var universalEpochTime = false
  var lastRefreshedTime = false
  var workers = parameters.servers.map(serverCfg => () => Sntp.time({ host: serverCfg.host, port: serverCfg.port }))

  var refreshTime = () => {
    universalEpochTime = false
    var f = i => {
      workers[i % workers.length]().then(data => {
        universalEpochTime = parseInt(data.receiveTimestamp)
        lastRefreshedTime = Date.now()
      }).catch(() => i > 0 && f(--i))
    }
    f(parameters.tryServerTimes * workers.length)
  }

  refreshTime()

  var interval = setInterval(refreshTime, 60 * 1000 * parameters.pollIntervalMins)

  this.dispose = () => {
    workers.length = 0
    clearInterval(interval)
    this.now = () => {}
    this.dispose = () => {}
  }

  this.now = () => universalEpochTime ? universalEpochTime + Date.now() - lastRefreshedTime : -1

  this.seq = () => {
    seqNr = seqNr + BigInt(1)
    return seqNr.toString()
  }

  this.uid = () => uid.toString()
}

module.exports = TimeMonitor
