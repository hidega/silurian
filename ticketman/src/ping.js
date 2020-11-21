'use strict'

var RestClient = require('./rest-client')
var parseParams = require('./parse-params')

module.exports = (p, callback) => {
  var params = parseParams(p)
  var url = `http://${params.restEndpoint.host}:${params.restEndpoint.port}/${params.ticketManager.urlBasePath}`.replace(/\/+$/, '')
  var restClient = new RestClient({ url })
  restClient.obtainTicket('userid', 'appctx', Date.now()).then(() => callback()).catch(e => e || 1)
}
