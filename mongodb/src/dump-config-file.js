'use strict'

module.exports = (tools, cfg, callback) => { 
  try {
    tools.dumpConfigFile()
    tools.info('Config file was written')
    callback(0)
  } catch(e) {
    tools.error(e)
    callback(255)
  }
}