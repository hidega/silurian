'use strict'
 
const axios = require('axios')

function RestClient(p) {
  const self = this 

  const params = Object.assign({ url: 'http://127.0.0.1:56631/mailer' }, p)
  params.url = params.url.replace(/\/+$/, '')

  self.ping = () => axios({ method: 'get', url: params.url + '/ping' })

  self.sendmail = (mailOpts, transportOpts) => axios({ 
    method: 'post', 
    url: params.url + '/ping',
    data: { transportOpts: params.transportOpts || transportOpts, mailOpts }
  })
}

module.exports = RestClient
