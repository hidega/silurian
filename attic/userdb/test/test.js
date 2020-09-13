'use strict'

const assert = require('assert')
const userdb = require('../src')

const caseStatic = () => {
  const db = new userdb.StaticUserdatabase('../test/users')
  
  db.find(['user_a', 'user_b', 'user_y'], data => { 
    assert(data.length===2)
    assert(data[0].name==='user_a')
    assert(data[1].name==='user_b')
  })
  db.find('user_a', data => {
    assert(data.length===1)
    assert(data[0].name==='user_a')
  })
  db.findLike('user', data => { 
    assert(data.length===4)
    assert(data[0].name==='user_a')
    assert(data[1].name==='user_b')
    assert(data[2].name==='user_c')
    assert(data[3].name==='user_x')
  })  
  db.findGroup('ADMIN', data => {
    assert(data.length===3)
  })  
}

const caseStaticRest = () => {
  userdb.StaticUserdatabase.startService({
    dbFile: '../test/users',
    restEndpoint: {
      logToStdout: true
    }
  })
}

const caseSimple = () => {
  
}

//caseStatic()
caseStaticRest()

console.log('Tests are OK')
