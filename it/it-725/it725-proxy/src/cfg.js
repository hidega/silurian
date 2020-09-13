'use strict'

const {configuration} = require('@silurian/it725-commons')

module.exports = {
  ssl: {
    key: false,
    cert: false
  },
  port: 18443,
  mode: 'https',
  boundIp: configuration.publicIp,
  redirectionTable: [
    {
      selector: 'hello',
      port: configuration.helloworld.port,
      hosts: [configuration.innerHostname],
      path: '/'
    }, {
      selector: 'wss',
      websocket: true,
      port: configuration.wss.port,
      hosts: [configuration.loopbackIp],
      path: '/'
    }, {
      selector: 'web',
      port: configuration.web.port,
      hosts: [configuration.web.host],
      path: '/get-file'
    }
  ]
}
