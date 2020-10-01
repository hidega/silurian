'use strict'

const hosts = {
  lagrange: 'lagrange.dmznet',
  cauchy: 'cauchy.dmznet',
  gauss: 'gauss.dmznet',
  euler: 'euler.dmznet',
  dedkind: 'dedkind.dmznet'
}

const cfg = {
  hosts,
  mongodb: {
    host: hosts.gauss,
    port: 27017
  },
  helloworld: {
    port: 8080
  },
  wss: {
    port: 6922
  },
  web: {
    host: hosts.cauchy,
    port: 4187
  },
  syslog: {
    host: hosts.euler,
    port: 1583
  },
  eventsources: {
    host: hosts.cauchy,
    port: 7785
  },
  eventhandlers: {
    host: hosts.cauchy,
    port: 2385
  },
  counters: {
    host: hosts.cauchy,
    port: 3850
  },
  fileServer: {
    host: hosts.cauchy,
    port: 9284
  },
  publicIp: '95.140.42.5',
  innerHostname: 'serverhost.publicnet',
  loopbackIp: '127.0.0.1',
  projectId: 'IT-725'
}

module.exports = cfg
