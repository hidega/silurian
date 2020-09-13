'use strict'

const path = require('path')
const commons = require('@permian/commons')

const workDir = path.resolve(commons.files.currentDir(), './work')
const localhost = '127.0.0.1'
//const publichost = '95.140.42.5'
const publichost = 'localhost'

const cfg = {
  workDir,
  pki: {
    cryptoService: {
      profile: 'default',
      secretKey: Buffer.from('sSdf4ljhHJ8xc45dh-.)HJr76Q5xz8.&@')
    }
  },
  timeService: {
    host: localhost,
    ntpRefreshRateSec: 5*60,
    port: 6031
  },
  memht: {
    host: localhost,
    port: 2330
  },
  fileServer: {
    host: localhost,
    basedir: path.resolve(commons.files.currentDir(), './files'),
    urlBasePath: 'web/file-service',
    port: 9222
  },
  ticketManager: {
  },
  helloworld: {
    host: publichost,
    pidfile: path.resolve(workDir, 'helloworld.pid'),
    port: 8080
  },
  userDb: {
    kind: 'static',
    usersFile: path.resolve(commons.files.currentDir(), './res/users.json'),
  },
  servlet: {
    ticketTimeoutMs: 60*2*1000,
    host: localhost,
    port: 3981,
    maxConnections: 10
  }
}

cfg.proxy = {
  ssl: {
    key: false,
    cert: false,
  },
  port: 18443,
  mode: 'https',
  boundIp: publichost,
  redirectionTable: [
    {
      selector: 'hello',
      port: 8080,
      path: '/'
    }, {
      selector: 'services',
      port: 3981,
      path: '/'
    }, {
      selector: 'web',
      port: 9222,
      path: '/' + cfg.fileServer.urlBasePath + '/get-file'
    }, {
      selector: 'login',
      port: 9222,
      path: '/' + cfg.fileServer.urlBasePath + '/get-file/login.html'
    }, {
      selector: '',
      port: 9222,
      path: '/' + cfg.fileServer.urlBasePath + '/get-file/login.html'
    }
  ]
}

module.exports = cfg
