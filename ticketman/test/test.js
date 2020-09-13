'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const ticketman = require('../src')
const BaseTicketManager = require('../src/basetm')
const SimpleTicketManager = require('../src/simple')

const checkError = err => err && (console.log(err) || assert.fail())

const caseBaseTm = () => {
  const basetm = new BaseTicketManager()
  
  for(let i=0; i<20; i++) {
    const salt = basetm.generateSalt()
    assert(typeof salt === 'string' && /[0-9]{4,12}/.test(salt))
  }
  
  const data = 'Furulya'  
  const encodedData = basetm.encode(Buffer.from(data))
  const decodedData = basetm.decode(encodedData)
  assert(data===decodedData.toString())

  basetm.encode(Buffer.from(data))
  basetm.encode(Buffer.from(data))
  basetm.encode(Buffer.from(data))
}

const caseSimple = () => {
  const stm = new SimpleTicketManager()
  
  const userId = 'JohnDoe'  
  const appContext = 'app123'
  const expiresEpoch = 123456789
  
  let ticket1 = false
  let ticket2 = false

  stm.obtainTicket(userId, appContext, expiresEpoch)
  .then(ticket => {
    ticket1 = ticket
    return stm.decodeTicket(ticket)
  })
  .then(decodedTicket => assert(decodedTicket.userId===userId && decodedTicket.appContext===appContext && decodedTicket.expiresEpoch===expiresEpoch))
  .then(() => stm.obtainTicket(userId, appContext, expiresEpoch))
  .then(ticket => {
    ticket2 = ticket
    return stm.decodeTicket(ticket)
  })
  .then(decodedTicket => assert(decodedTicket.userId===userId && decodedTicket.appContext===appContext && decodedTicket.expiresEpoch===expiresEpoch))
  .then(() => assert(ticket1.compare(ticket2)!==0))
  .catch(checkError) 
}

/*const caseReferential = () => {
  let ticket
  const ENCODED_ID = Buffer.from('ENCODED_ID')
  
  const reftm = ticketman.TicketManagerFactory.createInstance('referential', {}, {
    get: (id, callback) => callback(false, ticket),
    upsert: (userId, appContext, expiresEpoch, callback) => {
      ticket = { userId, appContext, expiresEpoch }
      callback(false, ENCODED_ID)
    }
  })
  
  const userId = 'JohnDoe'
  const appContext = 'app123'
  const expiresEpoch = 123456789
    
  reftm.obtainTicket(userId, appContext, expiresEpoch, (err, ticket) => {
    checkError(err)
    reftm.decodeTicket(ticket, (err, userData) => {
      checkError(err)
      assert(userData.userId===userId && userData.appContext===appContext && userData.expiresEpoch===expiresEpoch)
    })
  })
}*/

caseBaseTm()

caseSimple()

//caseReferential()

console.log('Test are OK')
