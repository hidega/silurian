'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const kvps = require('../src')

const checkError = err => err && (console.log(err) || assert.fail())

const echo = str => console.log('- ', str)

const assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

const casePromiseChain = () => {
  new Promise((resolve, reject) => { 
    setTimeout(() => resolve(1), 1000) // the newly created promise is fulfullied
  }).then(result => {
    console.log(result) // 1
    return new Promise((resolve, reject) => { setTimeout(() => resolve(result * 2), 1000) })
  }).then(result => { 
    console.log(result) // 2
    return new Promise((resolve, reject) => { setTimeout(() => resolve(result * 2), 1000) })
  }).then(result => {   // If the returned value is a promise, then the further execution is suspended until it settles (fails or suceeds). 
    console.log(result) // 4
    return 5
  }).then(result => {   // When a value returned by a .then() handler, it is immediately passed to the next handler. 
    console.log(result) // 5
  }).then(() => Promise.resolve(6))  // note that    .then(Promise.resolve(6))   does not work
  .then(console.log)    // 6
}

const caseCombined = () => { 
  const keyA = 'keyA'
  const objA = { a : 'A' }
  const keyB = 'keyB'
  const objB = { b : 'B' }
  const keyC = 'keyC'
  const objC = { c : 'C' }
  const keyD = 'keyD'
  const objD = { d : 'D' }
  const keyE = 'keyE'
  const objE = { e : 'E' }
  const keyF = 'furulya'
  const objF = { c:1, d:2, e:3, f:4, g:5, a: 6, b: 7, C: 8 }

  const keyX = 'keyX'
  const objX1 = { x1 : 'X1' }
  const objX2 = { x2 : 'X2' }
  const objX3 = { x3 : 'X3' }

  const keyN1 = 'keyN1'
  const objN1 = { data : 'n1' }
  const keyN11 = 'keyN11'
  const objN11 = { data : 'n11' }
  const keyN12 = 'keyN12'
  const objN12 = { data : 'n12' }
  const keyN111 = 'keyN111'
  const objN111 = { data : 'n111' }
  const keyN112 = 'keyN112'
  const objN112 = { data : 'n112' }

  kvps.Connector.createInstance({
    mongodb: {
      username: 'superuser',
      password: 'superuser'
    },
    databaseName: 'testdb',
    kvpsId: 'Silurian KVPS test',
    collectionName: 'kvpsData'
  }, (err, connector) => {
    checkError(err)
    connector.removeLike('')
    .then(() => connector.diagnostics())
    .then(diags => assert(diags.entryCount===0 && !diags.error))
    .then(() => connector.put(keyF, objF))
    .then(() => connector.put(keyA, objA))
    .then(() => {
      connector.get(keyA, entry => assertEquals(objA, entry.data), checkError)
      connector.get(keyF, entry => assertEquals(objF, entry.data), checkError)
      return 1
    })
    .then(() => connector.diagnostics())
    .then(diags => assert(diags.entryCount===2 && !diags.error))
    .then(() => connector.putMany([
      kvps.Connector.createEntry(keyC, objC),
      kvps.Connector.createEntry(keyD, objD),
      kvps.Connector.createEntry(keyE, objE)
    ]))
    .then(() => connector.diagnostics())
    .then(diags => assert(diags.entryCount===5 && !diags.error))
    .then(() => {
      connector.get('==***', assert.fail, checkError)
      connector.put('==***', {}).then(assert.fail).catch(() => {})
      return 1
    })
    .then(() => connector.remove(keyE))
    .then(() => {
      connector.get(keyE, assert.fail, checkError) 
      return 1
    })
    .then(() => connector.has(keyE))
    .then(result => assert(result.length===0))
    .then(() => connector.has(keyD))
    .then(result => assert(result.length===1 && result[0].key===keyD))
    .then(() => connector.put(keyX, objX1))
    .then(() => connector.put(keyX, objX2))
    .then(() => connector.put(keyX, objX3))
    .then(() => {
      connector.get(keyX, entry => assertEquals(objX3, entry.data), checkError) 
      return 1
    })
    .then(() => connector.hasMany([keyB, keyA, keyC]))
    .then(result => assert(result.length===2) && result[0].key!==result[1].key && (result[0].key===keyA || result[0].key===keyC) && (result[1].key===keyA || result[1].key===keyC))
    .then(() => {
      let counter = 0
      connector.getMany([keyA, keyB, keyC], entry => counter++, () => assert(counter===2))
      return 1
    })    
    .then(() => connector.putMany([
      kvps.Connector.createEntry(keyN1, objN1),
      kvps.Connector.createEntry(keyN11, objN11),
      kvps.Connector.createEntry(keyN12, objN12),
      kvps.Connector.createEntry(keyN111, objN111),
      kvps.Connector.createEntry(keyN112, objN112)
    ]))
    .then(() => connector.removeLike('keyN11'))
    .then(() => connector.keysLike('keyN1'))
    .then(result => assert(result.length===2))
    .then(() => connector.removeMany([ keyC, keyB ]))
    .then(() => connector.diagnostics())
    .then(diags => assert(diags.entryCount===6 && !diags.error))
    .then(() => {
      connector.dumpDatabase(console.log, checkError) 
      return 1
    })
    .then(() => setTimeout(connector.shutdown, 4000))
    .then(() => console.log('\n----- caseCombined is OK\n'))
    .catch(checkError)
  })
}

//casePromiseChain()
caseCombined()
 
