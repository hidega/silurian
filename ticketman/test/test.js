'use strict'

var assert = require('assert')
var ticketman = require('../src')
var BaseTicketManager = require('../src/basetm')
var SimpleTicketManager = require('../src/simple')

var checkError = err => err && (console.log(err) || assert.fail())

var caseBaseTm = () => {
  var basetm = new BaseTicketManager()
  
  for(var i=0; i<20; i++) {
    var salt = basetm.generateSalt()
    assert(typeof salt === 'string' && /[0-9]{4,12}/.test(salt))
  }
  
  var data = 'Furulya'  
  var encodedData = basetm.encode(Buffer.from(data))
  var decodedData = basetm.decode(encodedData)
  assert.equal(data, decodedData.toString())

  basetm.encode(Buffer.from(data))
  basetm.encode(Buffer.from(data))
  basetm.encode(Buffer.from(data))

  return Promise.resolve()
}

var caseSimple = () => {
  var stm = new SimpleTicketManager()
  
  var userId = 'JohnDoe'  
  var appContext = 'app123'
  var expiresEpoch = 123456789
  
  var ticket1 = false
  var ticket2 = false

  return stm.obtainTicket(userId, appContext, expiresEpoch)
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

caseBaseTm().then(() => caseSimple()).then(() => console.log('Test are OK'))
