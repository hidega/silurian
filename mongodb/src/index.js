'use strict'

const ping = require('./ping')
const init = require('./init')
const purge = require('./purge')
const restart = require('./restart')
const shutdown = require('./shutdown')
const dumpConfigFile = require('./dump-config-file')

function MongoDbManager(tools, cfg) {
  const self = this
 
  const wrap = (f, callback) => f(tools, cfg, callback || (() => {}))

  self.ping = callback => wrap(ping, callback)
  self.init = callback => wrap(init, callback)
  self.purge = callback => wrap(purge, callback)
  self.restart = callback => wrap(restart, callback)
  self.shutdown = callback => wrap(shutdown, callback)
  self.dumpConfigFile = callback => wrap(dumpConfigFile, callback)
}

module.exports = MongoDbManager