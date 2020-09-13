'use strict'

module.exports = (tools, cfg, callback) => {
  tools.shutdownServer().then(result => {
    tools.infoJson(result.output)
    if(result.code===253) {
      tools.info('Server was shut down.')
    } else {
      tools.info(`Could not shut down the server, perhaps it is not running. Result code: ${result.code}`)
    }
    callback(0)
  }).catch(err => {
    tools.errorJson(err)  
    callback(1)
  })
}
