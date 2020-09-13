'use strict'

const FileServer = require('@silurian/filesrv')
const memht = require('@silurian/memht')
const timeService = require('@silurian/time-service')
const helloworld = require('@silurian/helloworld')
const proxy = require('@permian/proxy')
const cfg = require('./configuration')
const pki = require('./pki')
const startServlet = require('./servlet')

const start = () => {  
  memht.Endpoint.start({
    restEndpoint: {
      id: 'Inmemory hashtable',
      host: cfg.memht.host,
      port: cfg.memht.port,
      urlBasePath: 'memht',
      logToStdout: true
    },
  })
  
  FileServer.start({
    restEndpoint: {
      id: 'File server',
      host: cfg.fileServer.host,
      port: cfg.fileServer.port,
      urlBasePath: cfg.fileServer.urlBasePath,
      logToStdout: true
    },
    fileServer: {
      basedir: cfg.fileServer.basedir
    }
  })

  timeService.Endpoint.start({ 
    restEndpoint: {
      id: 'Time service',
      host: cfg.timeService.host,
      port: cfg.timeService.port,
      urlBasePath: '/',
      logToStdout: true 
    },    
    timeMonitor: {
      pollIntervalMins: parseInt(cfg.timeService.ntpRefreshRateSec/60)
    }
  })

  helloworld.start({
    pidfile: cfg.helloworld.pidfile,
    port: cfg.helloworld.port,
    host: cfg.helloworld.host
  })
  
  startServlet(cfg.servlet)

  const proxyCfg = cfg.proxy
  proxyCfg.ssl.key = pki.getServerSslKey()
  proxyCfg.ssl.cert = pki.getServerSslCert()
  proxy.startInstance(proxyCfg)
}

start()
