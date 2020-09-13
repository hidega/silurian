'use strict'

const http = require('http')

module.exports = cfg => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/xml' })
    res.write(`<?xml version="1.0" encoding="UTF-8"?><p>Hello world!<br/>${new Date().toISOString()}</p>`)
    res.end()
  })
  cfg.socket ? server.listen(cfg.socket) : server.listen(cfg.port, cfg.host)
  return () => {
    server.setTimeout(1000)
    server.close()
  }
}
