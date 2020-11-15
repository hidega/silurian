'use strict'

var restclient = require('@permian/restclient')

function RestClient(opts) {
  var options = Object.assign({
    defaultTimeoutMs: 10000,
    url: 'http://127.0.0.1:5802/file-service'
  }, opts)

  var httpGet = p => restclient({
    method: 'get',
    timeout: p.timeoutMs || options.defaultTimeoutMs,
    responseType: p.responseType || 'json',
    url: p.url
  })

  this.getFile = (filename, p, params = (p || {})) => httpGet({
    responseType: params.stream ? 'stream' : 'arraybuffer',
    url: options.url + '/get-file?path=' + filename.replace(/^\/+/, '') + (params.zipped ? '&zipped=1' : '')
  })

  this.listDirectory = (dirname, timeoutMs) => httpGet({ url: options.url + '/list-directory?path=' + dirname, timeoutMs })

  this.ping = timeoutMs => httpGet({ url: options.url + '/ping', timeoutMs })
}

module.exports = RestClient
