'use strict'

const mariadbfw = require('@permian/mariadbfw')
const commons = require('./commons')

module.exports = cmdAdapter => {
  const cfg = cmdAdapter.getConfiguration()
  return cmdAdapter.mariadb([
      '--user=' + cfg.superuserName,
      '-e',
      `set password for ${mariadbfw.Tools.fullUsername(cfg.superuserName, cfg.defaultHostname)} = password('${cfg.superuserPwd}')`
    ])
    .then(result => result.code === 0 || commons.throwError(JSON.stringify(result.output || {})))
}
