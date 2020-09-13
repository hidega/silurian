'use strict'

const path = require('path')
const Tools = require('./tools')
const MongoDbManager = require('../src')

const appDir = '/opt/app'
const dataDir = path.resolve(appDir, 'data', 'mongodb')
const prgDir = path.resolve(appDir, 'prg', 'mongodb')

const cfg = {
  mongodb: {
    uid: 1006,
    gid: 1006,
    ip: '127.0.0.1',
    port: 27017,
    authenticationDatabase: 'admin',
    superuserName: 'admin',  
    superuserPwd: 'adminpwd',
    mwuserName: 'mwuser',
    mwuserPwd: 'mwuserpwd',
    mwDbs: ['middlewareCenter', 'middlewareNorth', 'middlewareSouth', 'middlewareWest', 'middlewareEast', 'middlewareNorthwest', 'middlewareSouthwest', 'middlewareSoutheast', 'middlewareNortheast'],  
    prgDir: prgDir,
    verbosity: 1,
    appBinDir: path.resolve(prgDir, 'bin'),
    configFilePath: path.resolve(prgDir, 'mongod.conf'),
    loopbackIp: '127.0.0.1',
    pidFilePath: path.resolve(prgDir, 'server.pid'),
    dataDir: dataDir
  } 
}

const tools = new Tools(cfg)

const mongoDbManager = new MongoDbManager(tools, cfg)

if(process.argv[2]) { 
  try {
    mongoDbManager[process.argv[2]](n => {
      console.log('Exit code : ' + n)
      process.exit(n)
    })
  } catch(f) { 
    console.log(f, '\nError while running the command\n', f)
    process.exit(125)
  }   
} else {
  console.log('No action specified')
  process.exit(127)
}


