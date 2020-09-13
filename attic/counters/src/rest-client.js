'use strict'

const axios = require('axios')

function RestClient(p) {
  const self = this 

  const params = Object.assign({ 
    url: 'http://127.0.0.1:30297/counters'
  }, p)

  const nameParameter = name => name ? '?name=' + name : ''

  const nameValParameters = (name, val) => (name || val ? '?' : '') + 
                                           (name ? 'name=' + name + (val ? '&' : ''): '') + 
                                           (val ? 'val=' + val : '')

  self.increment = (name, val) => axios({ 
    method: 'put', 
    url: params.url + '/increment' + nameValParameters(name, val)
  })

  self.reset = name => axios({ 
    method: 'delete', 
    url: params.url + '/reset' + nameParameter(name)
  })

  self.get = name => axios({ 
    method: 'get', 
    url: params.url + '/get' + nameParameter(name)
  })

  self.incrementAndGet = (name, val) => axios({ 
    method: 'get', 
    url: params.url + '/increment-and-get' + nameValParameters(name, val)
  })
}

module.exports = RestClient
