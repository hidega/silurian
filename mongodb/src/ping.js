'use strict'

module.exports = (tools, cfg, callback) => {  
  tools.pingServer().then(result => {
    tools.infoJson(result.output)
    if(result.code===0) {
      tools.info('The server responded.')
    } else {
      tools.info('The server did not respond.')
    }
    callback(0)
  }).catch(err => {
    tools.errorJson(err)
    tools.error('An error occured.')
    callback(1)
  })
}
