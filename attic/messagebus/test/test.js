'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const messagebus = require('../src')

const checkError = err => err && (console.log('* ERROR *\n', JSON.stringify(err, null, 2)) || assert.fail())

const assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

const createBatchData = (uid, payload, start, end) => ({
  [messagebus.BatchProtocol.UID_KEY]: uid,
  [messagebus.BatchProtocol.PAYLOAD_KEY]: payload,
  [messagebus.BatchProtocol.START_INDEX_KEY]: start,
  [messagebus.BatchProtocol.END_INDEX_KEY]: end
})

const caseBatchProducer = () => {
  let counter = 0
  const producer = new messagebus.BatchProducer('UID_1', (data, callback) => {
    counter++
    if(counter===1) {
      assert(data.payload.length===6 && data.payload[0].a===0 && data.payload[1].a===1 && data.payload[2].a===2 && data.payload[3].a===3 && data.payload[4].a===4 && data.payload[5].a===5)
    } else if(counter===2) {
      assert(data.payload.length===2 && data.payload[0].a===6 && data.payload[1].a===7)
    } else {
      checkError('invalid invocation')
    } 
    callback()
  })
  producer.push({ a: 0 })
  .then(() => producer.push({ a: 1 }))
  .then(() => producer.push({ a: 2 }))
  .then(() => producer.push({ a: 3 }))
  .then(() => producer.push({ a: 4 }))
  .then(() => producer.push({ a: 5 }))
  .then(() => producer.push({ a: 6 }))
  .then(() => producer.push({ a: 7 }))
  .then(() => producer.close())
  .catch(checkError)
}

const caseBatchDefault = () => {
  const producer = new messagebus.BatchProducer('UID_1', (data, callback) => callback(1))
  producer.push({ a: 0 })
  .then(() => producer.push({ a: 1 }))
  .then(() => producer.push({ a: 2 }))
  .then(() => producer.push({ a: 3 }))
  .then(() => producer.push({ a: 4 }))
  .then(() => producer.push({ a: 5 }))
  .then(err => assert.fail('invalid invocation'))
  .catch(err => assert(err===1))

  let counter = 0
  const consumer = new messagebus.BatchConsumer((data, done, uid) => {
    assert(uid==='_uid3_')
    counter++
    if(counter>1) {
      checkError('invalid invocation')
    } else {
      assert(done)
      assert(data===1)
    }
  })
  consumer.onData(createBatchData('_uid3_', [1], 0, -1))
}

const caseBatchConsumer = () => {
  let counter = 0
  const buffer = []
  const uid2 = 'UID_2'   

  const consumer = new messagebus.BatchConsumer((data, done, uid) => {
    assert(uid===uid2)
    buffer.push(data)
    counter++
    if(counter>9) {
      checkError('invalid invocation')
    } else if(counter===9) {
      assert(done)
      assert(buffer.length===9 && buffer[0]===1 && buffer[1]===2 && buffer[2]===3 && buffer[3]===4 && buffer[4]===5 && buffer[5]===6 && buffer[6]===7 && buffer[7]===8 && buffer[8]===9)
    } else {
      assert(!done)
    }
  })
 
  consumer.onData(createBatchData(uid2, [1], 0, 0))
  consumer.onData(createBatchData(uid2, [2, 3], 1, 2))
  consumer.onData(createBatchData(uid2, [6, 7, 8], 5, 7))
  consumer.onData(createBatchData(uid2, [4, 5], 3, 4))
  consumer.onData(createBatchData(uid2, [9], 8, -1))
}

const caseBatchConsumerDataloss = () => {
  let counter = 0
  const buffer = []
  const uid2 = 'UID_4'   

  const consumer = new messagebus.BatchConsumer((data, done) => {
    buffer.push(data) 
    assert(!done)
    counter++
    if(counter>8) {
      checkError('invalid invocation')
    } else if(counter===8) {
      assert(buffer.length===8 && buffer[0]===1 && buffer[1]===2 && buffer[2]===3 && buffer[3]===4 && buffer[4]===5 && buffer[5]===6 && buffer[6]===7 && buffer[7]===8)
    }
  })
 
  consumer.onData(createBatchData(uid2, [1, 2, 3], 0, 2))
  consumer.onData(createBatchData(uid2, [6, 7, 8], 5, 7))
  consumer.onData(createBatchData(uid2, [10], 9, -1))
  consumer.onData(createBatchData(uid2, [4, 5], 3, 4))
}

const caseBrokerToManySubscriptions = () => {
  const broker = new messagebus.Broker({ maxPendingSubscriptions: 4 })
  assert(broker.subscribe(() => {})!==messagebus.Broker.TOO_MANY_SUBSCRIPTIONS)
  assert(broker.subscribe(() => {})!==messagebus.Broker.TOO_MANY_SUBSCRIPTIONS)
  assert(broker.subscribe(() => {})!==messagebus.Broker.TOO_MANY_SUBSCRIPTIONS)
  assert(broker.subscribe(() => {})!==messagebus.Broker.TOO_MANY_SUBSCRIPTIONS)
  assert(broker.subscribe(() => {})===messagebus.Broker.TOO_MANY_SUBSCRIPTIONS)
}

const caseBrokerBasics = () => {
  const broker = new messagebus.Broker()

  let counter = 0

  const uidA = broker.subscribe((err, data, uid) => {
    assert(!err && data===1 && uid==='uidA')
    counter++
    return true
  }, { uid: 'uidA'})
  assert(uidA==='uidA')

  const uidB = broker.subscribe((err, data, uid) => {
    assert(!err && data===2 && uid==='uidB')
    counter++
    return false
  }, { uid: 'uidB'})
  assert(uidB==='uidB')
  
  broker.processMessage(1, 'uidA')
  broker.processMessage(1, 'uidA')
  broker.processMessage(1, 'uidA')

  broker.processMessage(2, 'uidB')
  broker.processMessage(2, 'uidB')
  broker.processMessage(2, 'uidB')

  const uidC = broker.subscribe((err, data, uid) => {
    assert(!err && data===3 && uid===uidC)
    counter++
    return false
  })
  broker.processMessage(3, uidC)

  const uidD = broker.subscribe(err => {
    counter++
    assert(err===messagebus.Broker.TIMEOUT)
  }, { timeout: 500}) 

  setTimeout(() => {
    broker.processMessage(0, uidD)
  }, 1000)

  setTimeout(() => {
    assert(counter===6)
  }, 1500)
}

const caseBatchCombined = () => {
  
}

//caseBrokerBasics()
//caseBrokerToManySubscriptions()
caseBatchDefault()
caseBatchProducer()
caseBatchConsumer()
caseBatchCombined()
caseBatchConsumerDataloss()
