'use strict'

const http = require('http') 
const commons = require('@permian/commons')
const PidfileBasedManagement = require('@permian/pfbm')

const startService = cfg => {
  if(!cfg.newLocation || (!cfg.newLocation.startsWith('http://') && !cfg.newLocation.startsWith('https://'))) {
    throw new Error('Error: the newLocation parameter should start with  http(s):// | ' + cfg.newLocation)
  }

  const server = http.createServer((req, res) => {
    res.writeHead(301, { 'Content-Type': 'text/html', 'Location': `${cfg.newLocation}${req.url}` })
    res.write(
      `<html>
         <head>
           <title>Moved</title>
         </head>
         <body>
           <h1>Moved</h1>
           <p>This page has moved to <a href="${cfg.newLocation}${req.url}">${cfg.newLocation}${req.url}</a></p>
         </body>
       </html>`)
    res.end()
  }).listen(cfg.port, cfg.host) 

  return () => {
    server.setTimeout(1000)
    server.close()
  }
}

const HttpRedirector = { 
  stop: (cfg, callback) => PidfileBasedManagement.stop({
    forceKill: true,
    pidfile: cfg.pidfile
  }, callback || commons.proc.terminateProcess), 
  start: (cfg, callback) => PidfileBasedManagement.start({
    starter: (onReady, onClose) => onReady(startService(cfg)),
    pidfile: cfg.pidfile
  }, callback || commons.proc.terminateProcess), 
  ping: (cfg, callback) => PidfileBasedManagement.ping({
    pidfile: cfg.pidfile
  }, (err, result) => {
    const cb = callback || commons.proc.terminateProcess
    if(!err && result===0) { 
      cb('Could not find http redirector process by PID.')
    } else {
      const timeoutMs = 2000
      if(cfg.socket) {
        commons.net.checkIfSocketIsReachable(cfg.socket, timeoutMs, err => cb(err ? `${cfg.host}:${cfg.port} is not reachable.` : false))
      } else {
        commons.net.checkIfPortIsReachable(cfg.host, cfg.port, timeoutMs, err => cb(err ? `${cfg.host}:${cfg.port} is not reachable.` : false))
      }
    }
  })
}

module.exports = Object.freeze(HttpRedirector)

