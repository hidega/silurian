'use strict'

const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')

module.exports = (tools, cfg, callback) => { 
  tools.pingServer().then(result => {
    if(result===0) {
      tools.info('Server is running, data will not be deleted.')
      callback(0)
    } else {
      tools.info('\nWARNING! We are about to delete all data. You have 5 seconds to change your mind and abort by pressing Ctrl-C.\n')
      setTimeout(() => {
        try {
          cfg.mongodb.logFilePath && cfg.mongodb.logFilePathfs.removeSync(cfg.mongodb.logFilePath)
          fs.removeSync(cfg.mongodb.configFilePath)
          rimraf.sync(cfg.mongodb.dataDir.toString() + path.sep + '*')
          callback(0)
        } catch(e) {
          tools.error('Could not delete some files: ' + e)
          tools.errorJson(e)
          callback(1)
        }
      }, 5000)
    }
  }).catch(err => {
    tools.errorJson(err)
    callback(2)
  }) 
}