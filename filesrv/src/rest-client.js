'use strict'

var axios = require('axios')

function RestClient(p) {
  var params = Object.assign({
    stream: true,
    defaultTimeoutMs: 10000,
    url: 'http://127.0.0.1:5802/file-service'
  }, p)

  this.getFile = (filename, params) => axios({
    method: 'get',
    timeout: params.timeoutMs || params.defaultTimeoutMs,
    responseType: params.stream ? 'stream' : 'arraybuffer',
    url: params.url + '/get-file?path=' + filename.replace(/^\/+/, '') + (params.zipped ? '&zipped=1' : '')
  })

  this.listDirectory = (dirname, timeoutMs) => axios({
    method: 'get',
    timeout: params.timeoutMs || params.defaultTimeoutMs,
    responseType: 'json',
    url: params.url + '/list-directory?path=' + dirname
  })

  this.ping = timeoutMs => axios({
    method: 'get',
    timeout: params.timeoutMs || params.defaultTimeoutMs,
    responseType: 'json',
    url: params.url + '/ping'
  })
}

module.exports = RestClient
