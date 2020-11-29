'use strict'

var RestClient = require('./rest-client')
var parseParams = require('./parse-params')

module.exports = (params, callback) => {
  params = parseParams(params)
  RestClient.newInstance({ url: `http://${params.restEndpoint.host}:${params.restEndpoint.port}/${params.timeMonitor.urlBasePath}` }).ping()
    .then(() => callback())
    .catch(e => callback(e || 1))
}
