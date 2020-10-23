'use strict'

var parseParameters = require('./parse-parameters')
var RestClient = require('./rest-client')

module.exports = (p, callback) => {
  var pingTimeoutMs = 10000
  var { host, port, urlBasePath } = parseParameters(p).restEndpoint
  var client = new RestClient({ url: 'http://' + host + ':' + port + '/' + urlBasePath })
  client.ping(pingTimeoutMs).then(() => callback()).catch(err => callback(err || 1))
}
