'use strict'

var restclient = require('@permian/restclient')
var RestEndpoint = require('./restendpoint')

function RestClient(p) {
  var params = Object.assign({
    url: 'http://127.0.0.1:30269/userdb',
    requestTimeoutSec: 10
  }, p)
  params.url = params.url.replace(/\/+$/, '')

  var httpGet = url => restclient({ method: 'get', url })

  this.ping = () => httpGet(params.url + '/ping')

  this.find = users => {
    Array.isArray(users) || (users = [users.toString()])
    return httpGet(params.url + '/find?users=' + users.join(RestEndpoint.USER_DELIMITER))
  }

  this.findLike = regexp => httpGet(params.url + '/find-like?regexp=' + Buffer.from(regexp).toString('hex'))

  this.findGroup = group => httpGet(params.url + '/find-group?group=' + group)
}

RestClient.newInstance = p => new RestClient(p)

module.exports = RestClient
