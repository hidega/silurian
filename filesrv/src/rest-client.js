'use strict'

const axios = require('axios')

function RestClient(p) {
  const self = this

  const params = Object.assign({
    url: 'http://127.0.0.1:5802/file-service'
  }, p)

  self.getFile = (filename, params) => axios({
    method: 'get',
    responseType: params.stream ? 'stream' : 'arraybuffer',
    url: params.url + '/get-file/' + filename.replace(/^\/+/, '') + (params.zipped ? '&zipped=1' : '')
  })

  self.listDirectory = dirname => axios({
    method: 'get',
    responseType: 'json',
    url: params.url + '/list-directory?path=' + dirname
  })
}

module.exports = RestClient
