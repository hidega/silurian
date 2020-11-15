'use strict'

var RestClient = require('./rest-client')

module.exports = (cfg, callback) => RestClient.newInstance({
  url: `http://${cfg.restEndpoint.host}:${cfg.restEndpoint.port}/${cfg.restEndpoint.urlBasePath}`
})
.getTime()
.then(() => callback())
.catch(e => callback(e || 1))
