'use strict'

const assert = require('assert')
const CmdAdapter = require('../src/cmd/adapter')
const Tools = require('../src/tools')
const cfgBuilder = require('./cfg-builder')

const cfg = cfgBuilder.build()
const cmdAdapter = new CmdAdapter(cfg)

// reset root pwd: ./mariadb --user=root -e "set password for 'root'@'localhost' = password('')"

cmdAdapter.pingDatabase()
.then(r => console.log('ping result: ', r))
.then(() => cmdAdapter.executeStatement({ 
  user: cfg.superuserName, 
  statement: 'select user(), current_user();' 
}))
.then(r => console.log('test query result: ', r))
.then(() => cmdAdapter.mariadb([
  '--user=' + cfg.superuserName, 
  '-e', 
  `set password for ${Tools.fullUsername(cfg.superuserName, cfg.defaultHostname)} = password('${cfg.superuserPwd}')`
]))
.then(r => console.log('root password setter result: ', r))
.then(() => cmdAdapter.executeStatement({ 
  user: cfg.superuserName,
  password: cfg.superuserPwd,
  statement: `set password for ${Tools.fullUsername(cfg.mysqlUserName, cfg.defaultHostname)} = password('${cfg.mysqlUserPwd}');` 
}))
.then(r => console.log('mysql password setter result: ', r))
.then(() => console.log('Tests are OK :)'))
.catch(err => {
  console.log('ERROR: \n', err)
  process.exit(1)
})
