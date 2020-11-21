'use strict'

var restclient = require('@permian/restclient')

function RestClient(p) {
  var params = Object.assign({
    timeoutMs: 10000,
    url: 'http://127.0.0.1:11290/ticketman'
  }, p)

  var httpGet = url => restclient({ method: 'get', responseType: 'json', url })

  this.obtainTicket = (userid, appctx, expires) => httpGet(`${params.url}/obtain-ticket?userid=${userid}&appctx=${appctx}&expires=${expires}`)

  this.decodeTicket = ticket => httpGet(params.url + '/decode-ticket?ticket=' + ticket)
}

module.exports = RestClient
