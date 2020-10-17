'use strict'

var mariadbfw = require('@permian/mariadbfw')
var ping = require('./ping')
var init = require('./init')
var purge = require('./purge')
var restart = require('./restart')
var shutdown = require('./shutdown')
var parseCfg = require('./parse-cfg')
var healthcheck = require('./healthcheck')
var setRootPwd = require('./set-root-pwd')
var dumpConfigFile = require('./dump-config-file')

function MariaDbManager(cfg) {
  var self = this
  var cmdAdapter = new mariadbfw.CommandAdapter(parseCfg(cfg))
  var wrap = (f, callback) => () => callback ? f(cmdAdapter).then(r => callback(false, r)).catch(e => callback(e || -1)) : f(cmdAdapter)
  self.ping = wrap(ping)
  self.init = wrap(init)
  self.purge = wrap(purge)
  self.restart = wrap(restart)
  self.shutdown = wrap(shutdown)
  self.setRootPwd = wrap(setRootPwd)
  self.healthcheck = wrap(healthcheck)
  self.dumpConfigFile = wrap(dumpConfigFile)
}

module.exports = {
  MariaDbManager: Object.freeze(MariaDbManager)
}
