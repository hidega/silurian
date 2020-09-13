'use strict'

module.exports = (tools, cfg, callback) => {
  let counter = 10
  tools.shutdownServer().then(() => {
    tools.info('The server was shut down or it was not running.')
  }).catch(err => {
    tools.info(err)
    tools.info('The server could not be shut down, perhaps it is not running.')
    counter = 1
  }).then(() => {
    tools.info('Restarting the server.')
    tools.startServer(counter).then(output => {      
      setTimeout(() => {
        tools.pingServer().then(result => {
          if(result.code===0) { 
            tools.info('The server appears to be running') 
            callback(0)
          } else {
            tools.error(`The server does not seem to be running: ${result.code}`)
            tools.errorJson(output)
            callback(3)
          }
        }).catch(err => {
          tools.error(err)
          tools.error('The server does not seem to be running')
          callback(1)
        })
      }, 3000)
    }).catch(output => {
      tools.errorJson(output)
      callback(2)
    })
  })
}
