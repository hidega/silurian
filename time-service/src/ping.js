'use strict'

var RestClient = require('./rest-client')

module.exports = (cfg, callback) => RestClient.newInstance({
  url: `http://${cfg.restEndpoint.host}:${cfg.restEndpoint.port}/${cfg.restEndpoint.urlBasePath}`
}).then(() => callback()).catch(() => callback(1))