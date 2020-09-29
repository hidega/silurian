'use strict'

const axios = require('axios')

function RestClient(p) {
  const self = this

  const params = Object.assign({
    url: 'http://127.0.0.1:25364/timeservice',
    refreshFrequencySec: 120
  }, p)
  params.url = params.url.replace(/\/+$/, '')

  let storedTime = Date.now()
  let lastRefreshedTime = Date.now()

  const refreshInterval = setInterval(() => self.getTime().then(obj => {
    storedTime = parseInt(obj.data.result) || -1
    lastRefreshedTime = Date.now()
  }).catch(e => storedTime = -1), params.refreshFrequencySec * 1000)

  self.getTime = () => axios({ method: 'get', url: params.url + '/gettime' })

  self.getStoredTime = () => storedTime === -1 ? -1 : storedTime + Date.now() - lastRefreshedTime

  self.getSequenceNr = () => axios({ method: 'get', url: params.url + '/seqnr' })

  self.dispose = () => clearInterval(refreshInterval)
}

module.exports = RestClient
