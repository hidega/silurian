'use strict'

var restclient = require('@permian/restclient')

function RestClient(p) {
  var params = Object.assign({
    url: 'http://127.0.0.1:25364/timeservice',
    requestTimeoutSec: 10,
    refreshFrequencySec: 120
  }, p)
  params.url = params.url.replace(/\/+$/, '')

  var storedTime = Date.now()
  var lastRefreshedTime = Date.now()

  var refreshInterval = setInterval(() => this.getTime().then(obj => {
    storedTime = parseInt(obj.data.result) || -1
    lastRefreshedTime = Date.now()
  }).catch(e => storedTime = -1), params.refreshFrequencySec * 1000)

  this.getTime = () => restclient({ method: 'get', url: params.url + '/gettime' })

  this.getStoredTime = () => storedTime === -1 ? -1 : storedTime + Date.now() - lastRefreshedTime

  this.getSequenceNr = () => restclient({ method: 'get', url: params.url + '/seqnr' })

  this.dispose = () => {
    clearInterval(refreshInterval)
    this.getStoredTime = () => -1
    this.getSequenceNr = () => -1
    this.getTime = () => -1
  }
}

RestClient.newInstance = p => new RestClient(p)

module.exports = RestClient
