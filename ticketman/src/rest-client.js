'use strict'

const axios = require('axios')

function RestClient(p) {
  const self = this

  const params = Object.assign({
    url: 'http://127.0.0.1:11290/ticketman'
  }, p)

  self.obtainTicket = (userid, appctx, expires) => axios({
    method: 'get',
    responseType: 'json',
    url: `${params.url}/obtain-ticket?userid=${userid}&appctx=${appctx}&expires=${expires}`
  })

  self.decodeTicket = ticket => axios({
    method: 'get',
    responseType: 'json',
    url: params.url + '/decode-ticket?ticket=' + ticket
  })
}

module.exports = RestClient
