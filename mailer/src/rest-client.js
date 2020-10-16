'use strict'

var axios = require('axios')

function RestClient(p) {
  var params = Object.assign({ url: 'http://127.0.0.1:56631/mailer' }, p)
  params.url = params.url.replace(/\/+$/, '')

  this.ping = () => axios({ method: 'get', url: params.url + '/ping' })

  this.sendmail = (mailOpts, transportOpts) => axios({
    method: 'post',
    url: params.url + '/ping',
    data: { transportOpts: params.transportOpts || transportOpts, mailOpts }
  })
}

module.exports = RestClient
