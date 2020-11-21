'use strict'

var pki = require('@permian/pki')

var throwIf = (c, msg) => {
  if(c) {
    throw new Error(msg)
  }
}

function BaseTicketManager(p) {
  this.params = Object.assign({
    separator: '!',
    saltLengthMin: 4,
    saltLengthMax: 12,
    cryptoServicesInstance: false,
    cryptoServicesCfg: {}
  }, p)

  throwIf(this.params.cryptoServicesInstance && this.params.cryptoServicesCfg, 'Bad config options')

  var cryptoServices = this.params.cryptoServicesInstance || new pki.CryptoServices(this.params.cryptoServicesCfg)

  this.reject = (e, callback) => callback ? callback(e) && false : Promise.reject(e)

  this.resolve = (o, callback) => callback ? callback(false, o) && false : Promise.resolve(o) 

  this.encode = cryptoServices.encodeSync

  this.decode = cryptoServices.decodeSync

  this.generateSalt = () => new Array(this.params.saltLengthMin + parseInt(Math.random(this.params.saltLengthMax - this.params.saltLengthMin)))
    .fill('').map(() => parseInt(Math.random() * 10)).join('')

  this.checkObtainParameters = (userId, appContext, expiresEpoch) => {
    throwIf(!userId || !appContext || !expiresEpoch, 'Missing parameter(s)')
    throwIf(userId.includes(this.params.separator) || appContext.includes(this.params.separator) || isNaN(expiresEpoch), `Invalid date or separator (${this.params.separator})`)
  }
}

module.exports = BaseTicketManager
