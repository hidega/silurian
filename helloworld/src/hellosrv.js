'use strict'

var http = require('http')

module.exports = cfg => {
  var id = 0

  var message = () => `<?xml version="1.0" encoding="UTF-8"?>
<message>
  <text>Hello world!</text>
  <id>${id = ++id % Number.MAX_SAFE_INTEGER}</id>
  <timestamp>${new Date().toISOString()}</timestamp>
</message>`

  var server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/xml' })
    res.write(message())
    res.end()
  })
  cfg.socket ? server.listen(cfg.socket) : server.listen(cfg.port, cfg.host)
  return () => {
    server.setTimeout(1000)
    server.close()
  }
}
