'use strict'

const Sntp = require('@hapi/sntp')

function TimeMonitor(params) {
  const self = this

  const parameters = Object.assign({
    servers: [
      { host: 'time.kfki.hu', port: 123 },
      { host: 'a.time.steadfast.net', port: 123 }
    ],
    pollIntervalMins: 10,
    tryServerTimes: 2
  }, params)

  let seqNr = BigInt(0)
  let universalEpochTime = false
  let lastRefreshedTime = false
  const workers = parameters.servers.map(serverCfg => () => Sntp.time({ host: serverCfg.host, port: serverCfg.port }))

  const refreshTime = () => {
    universalEpochTime = false
    const f = i => { 
      workers[i % workers.length]().then(data => {
        universalEpochTime = parseInt(data.receiveTimestamp)
        lastRefreshedTime = Date.now()
      }).catch(() => i>0 && f(--i))
    }
    f(parameters.tryServerTimes*workers.length)
  }

  refreshTime()

  const interval = setInterval(refreshTime, 60*1000*parameters.pollIntervalMins)

  self.dispose = () => {
    workers.length = 0
    clearInterval(interval)
    self.now = () => {}
    self.dispose = () => {}
  }

  self.now = () => universalEpochTime ? universalEpochTime + Date.now() - lastRefreshedTime : -1
  
  self.seq = () => {
    seqNr = seqNr + BigInt(1)
    return seqNr.toString()
  }
}

module.exports = TimeMonitor
