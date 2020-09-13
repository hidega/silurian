'use strict'
 
const axios = require('axios')

function RestClient(p) {
  const self = this 

  const params = Object.assign({ 
    url: 'http://127.0.0.1:23058/memqueue'
  }, p)
  params.url = params.url.replace(/\/+$/, '')

  self.diagnostics = () => axios({ method: 'get', url: params.url + '/diagnostics' })
}

module.exports = RestClient
