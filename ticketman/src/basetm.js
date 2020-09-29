'use strict'

const pki = require('@permian/pki')

function BaseTicketManager(p) {
  const self = this

  self.params = Object.assign({
    separator: '!',
    saltLengthMin: 4,
    saltLengthMax: 12,
    cryptoServicesInstance: false,
    cryptoServicesCfg: {}
  }, p)

  if (self.params.cryptoServicesInstance && self.params.cryptoServicesCfg) {
    throw new Error('Bad config options')
  }

  const cryptoServices = self.params.cryptoServicesInstance || new pki.CryptoServices(self.params.cryptoServicesCfg)

  self.encode = cryptoServices.encodeSync

  self.decode = cryptoServices.decodeSync

  self.generateSalt = () => new Array(self.params.saltLengthMin + parseInt(Math.random(self.params.saltLengthMax - self.params.saltLengthMin)))
    .fill('').map(() => parseInt(Math.random() * 10)).join('')

  self.checkObtainParameters = (userId, appContext, expiresEpoch) => {
    if (!userId || !appContext || !expiresEpoch) {
      throw new Error('Missing parameter(s)')
    }
    if (userId.includes(self.params.separator) || appContext.includes(self.params.separator) || isNaN(expiresEpoch)) {
      throw new Error(`Invalid date or separator (${self.params.separator})`)
    }
  }
}

module.exports = BaseTicketManager
