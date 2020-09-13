'use strict'

const fs = require('fs-extra')
const shutdown = require('./shutdown')

module.exports = (tools, cfg, callback) => { 
  const initializeMiddleware = () => {
    tools.info('Initializing the middleware system.')

    const script = `
      var admindb = db.getSiblingDB('${cfg.mongodb.authenticationDatabase}');
      admindb.grantRolesToUser('${cfg.mongodb.superuserName}', [{ role: 'root', db: '${cfg.mongodb.authenticationDatabase}' }]);
      admindb.createUser({ user: '${cfg.mongodb.mwuserName}', pwd: '${cfg.mongodb.mwuserPwd}', roles: [] });
      print('| success 1. |');
      [${tools.arrayToString(cfg.mongodb.mwDbs)}].forEach(function(database) {  
        var mwdb = db.getSiblingDB(database);
        admindb.grantRolesToUser('${cfg.mongodb.mwuserName}', [{ role: 'dbOwner', db: database }], { w: 'majority' , wtimeout: 4000 });
      });
      print(' success 2. '); 
    `

    tools.mongoShell(script, true).then(result => {
      if(result.code===0) {
        tools.infoJson(result.output)
        tools.info('\nOK - it seems that the database has been set up successfully :)')
        tools.info('Now the running database is being shut down')
        shutdown(cfg, () => tools.info('Success :)'))
        callback(0)
      } else {
        tools.errorJson(result.output)
        tools.error('Code: ' + result.code)
        callback(7)
      }
    }).catch(err => {
      tools.errorJson(err)
      callback(6)
    }) 
  }

  const initializeAdmin = () => {
    tools.info('Initializing the database. This may take a while.')

    const script = `
      var admindb = db.getSiblingDB('${cfg.mongodb.authenticationDatabase}'); 
      admindb.createUser({ 
        user: '${cfg.mongodb.superuserName}', 
        pwd: '${cfg.mongodb.superuserPwd}',  
        roles: ['userAdminAnyDatabase', 'dbAdminAnyDatabase', 'readWriteAnyDatabase'] }); 
      print('success 1.'); 
    `

    tools.startServer(5).then(result => {
      tools.mongoShell(script).then(result => {
        if(result.code===0) {
          tools.infoJson(result.output);
          initializeMiddleware()
        } else {
          tools.errorJson(result.output)
          tools.error('Code: ' + result.code)
          callback(5)
        }
      }).catch(err => {
        tools.errorJson(err)
        callback(4)
      })
    }).catch(err => {
      tools.errorJson(err)
      callback(3)
    })
  }

  tools.pingServer().then(result => {
    if(result.code===0) {
      tools.info('Server is online, shut it down to start initialization.')
      callback(0)
    } else {
      try {
        tools.dumpConfigFile()
        if(fs.existsSync(cfg.mongodb.dataDir)) {   
          const contents = fs.readdirSync(cfg.mongodb.dataDir)
          if(contents.length===0) {
            initializeAdmin()
          } else { 
            tools.info('Data dir is not empty. Delete it before initialization.')
            callback(0)
          }
        } else {
          fs.mkdirSync(cfg.mongodb.dataDir)
          initializeAdmin()
        }
      } catch(e) {
        tools.error(e)
        callback(2)
      }
    }
  }).catch(err => {
    tools.errorJson(err)
    tools.error('An error occured before starting initialization.')
    callback(1)
  })
}

