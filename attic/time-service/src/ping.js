'use strict'

var RestClient = require('./rest-client')
var parseCfg = require('./parse-cfg')

module.exports = (cfg, callback) => {
  cfg = parseCfg(cfg)
  RestClient.newInstance({ url: `http://${cfg.restEndpoint.host}:${cfg.restEndpoint.port}/${cfg.timeMonitor.urlBasePath}` }).getTime()
    .then(() => callback())
    .catch(e => callback(e || 1))
}
