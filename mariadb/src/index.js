'use strict'

const mariadbfw = require('@permian/mariadbfw')
const ping = require('./ping')
const init = require('./init')
const purge = require('./purge')
const restart = require('./restart')
const shutdown = require('./shutdown')
const parseCfg = require('./parse-cfg')
const healthcheck = require('./healthcheck')
const setRootPwd = require('./set-root-pwd')
const dumpConfigFile = require('./dump-config-file')

function MariaDbManager(cfg) {
  const self = this
  const cmdAdapter = new mariadbfw.CommandAdapter(parseCfg(cfg))
  const wrap = (f, callback) => () => callback ? f(cmdAdapter).then(r => callback(false, r)).catch(e => callback(e || -1)) : f(cmdAdapter)
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
