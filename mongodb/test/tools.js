'use strict'

const path = require('path')
const fs = require('fs-extra')
const commons = require('@permian/commons')
const mongodbfw = require('@permian/mongodbfw')

function MongodbTools(cfg) {
  const self = this

  mongodbfw.MongoDbTools.call(self, cfg)

  self.arrayToString = arr => arr.map(e => `'${e}'`).join(',')

  self.dumpConfigFile = () => {
    const isLinux = commons.platform.isLinux() 

    const mongodbCnf = `# generated on ${new Date()} \n
systemLog:
  verbosity: ${cfg.verbosity || '1'}
` + (cfg.mongodb.logFilePath ?
`  destination: file
  path: ${path.resolve(cfg.mongodb.logFilePath)}` : '') +    
`
storage:
  dbPath: ${path.resolve(cfg.mongodb.dataDir)}

security:
  authorization: "enabled"
  javascriptEnabled: false

net:
  ${(isLinux && cfg.mongodb.socket) || 'port: ' + cfg.mongodb.port}
  bindIp: ${(isLinux && cfg.mongodb.socket) ? cfg.mongodb.socket : cfg.mongodb.ip}

processManagement:
  pidFilePath: ${path.resolve(cfg.mongodb.pidFilePath)}
`
    fs.writeFileSync(cfg.mongodb.configFilePath, mongodbCnf)

    try {
      isLinux && fs.lchownSync(cfg.mongodb.configFilePath, cfg.mongodb.uid, cfg.mongodb.gid)
    } catch(e) {
      self.error('Could not set Linux owner and group')
    }
  }
}
 
module.exports = MongodbTools
