'use strict'

const {lang} = require('@permian/commons')

function Counters(methods) {
  const self = this

  self.defaultKey = Object.freeze('_default_')

  self.reset = lang.promisifyIfNoCallback1(methods.reset)

  self.increment = lang.promisifyIfNoCallback2(methods.increment)

  self.get = lang.promisifyIfNoCallback1(methods.get)

  self.incrementAndGet = lang.promisifyIfNoCallback2(methods.incrementAndGet)
}

module.exports = Counters