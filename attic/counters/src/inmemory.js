'use strict'

const {lang} = require('@permian/commons')
const Counters = require('./counters')

function InMemoryCounters() {
  const self = this

  let counters = {}

  Counters.call(self, {
    reset: (name, callback) => {
      counters[name || self.defaultKey] = BigInt(0)
      callback(false)
    },
    increment: (name, val, callback) => {
      name || (name = self.defaultKey)
      counters[name] || self.reset(name)
      counters[name] = counters[name] + BigInt(parseInt(val) || 1)
      callback(false)
    },
    get: (name, callback) => {
      name || (name = self.defaultKey)
      counters[name]===undefined && (counters[name] = BigInt(0))
      callback(false, counters[name].toString())
    },
    incrementAndGet: (name, val, callback) => {
      self.increment(name, val)
      callback(false, self.get(name))
    }
  })

  self.dispose = () => {
    counters = false
    lang.disableDeclaredFunctions(self)
  }
}

module.exports = InMemoryCounters
