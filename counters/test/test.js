'use strict'

const assert = require('assert')
const counters = require('../src')

const caseInMemory = () => {
  const counter = new counters.InMemoryCounters()
  counter.incrementAndGet()
  .then(result => assert(result==='1'))
  .then(counter.increment)
  .then(counter.increment)
  .then(counter.increment)
  .then(counter.increment)
  .then(counter.get)
  .then(result => assert(result==='5'))
  .then(() => counter.increment('foo'))
  .then(() => counter.increment('foo'))
  .then(() => counter.increment('foo'))
  .then(() => counter.get('foo'))
  .then(result => assert(result==='3'))
  .then(() => counter.get())
  .then(result => assert(result==='5'))
  .then(counter.reset)
  .then(counter.get)
  .then(result => assert(result==='0'))
  .then(() => counter.get('wazz'))
  .then(result => assert(result==='0'))
  .then(() => counter.reset('bar'))
  .then(() => counter.increment('bar'))
  .then(() => counter.increment('foo'))
  .then(() => counter.increment('bar'))
  .then(() => counter.get('bar'))
  .then(() => counter.incrementAndGet('foo'))
  .then(result => assert(result==='5'))
  .then(() => counter.increment('bar', 2))
  .then(() => counter.increment('foo', -1))
  .then(() => counter.increment('bar', -3))
  .then(() => counter.increment('bar', 'fghj'))
  .then(() => counter.get('bar'))
  .then(result => assert(result==='2'))
  .then(() => counter.incrementAndGet('foo'))
  .then(result => assert(result==='5'))
  .then(counter.dispose)
  .then(() => console.log('caseInMemory() tests are OK'))
  .catch(err => {
    console.log('* ERROR 1 *', err)
    process.exit(-2)
  })
}

const caseMongodbBacked = () => {
  let wazz = false
  counters.startMongoDbCounters({
    mongodb: {
      hosts: [{ host: 'localhost', port: 27017 }],
      username: 'superuser',
      password: 'superuser',
      authDbName: 'admin'
    },
    collectionName: 'counterstest1',
    databaseName: 'testdb'
  }, (err, counter) => {
    if(err) {
      console.log('* ERROR 2 *', err)
      process.exit(-2)
    }
    counter.reset()
    .then(result => assert(result===undefined))
    .then(() => counter.increment())
    .then(() => counter.incrementAndGet())
    .then(result => assert(result==='2'))
    .then(() => counter.increment())
    .then(() => counter.increment())
    .then(result => assert(result===undefined))
    .then(() => counter.increment())
    .then(() => counter.get())
    .then(result => assert(result==='5'))
    .then(() => counter.reset('foo'))
    .then(() => counter.increment('foo'))
    .then(() => counter.increment('foo'))
    .then(() => counter.increment('foo'))
    .then(() => counter.get('foo'))
    .then(result => assert(result==='3'))
    .then(() => counter.get())
    .then(result => assert(result==='5'))
    .then(() => counter.reset())
    .then(() => counter.get())
    .then(result => assert(result==='0'))
    .then(() => counter.get('wazz'))
    .then(result => wazz = result)
    .then(() => counter.increment('wazz'))
    .then(() => counter.get('wazz'))
    .then(result => assert(result===(BigInt(wazz) + BigInt(1)).toString()))
    .then(() => counter.reset('bar'))
    .then(() => counter.increment('bar'))
    .then(() => counter.increment('foo'))
    .then(() => counter.increment('bar'))
    .then(() => counter.get('bar'))
    .then(() => counter.incrementAndGet('foo'))
    .then(result => assert(result==='5'))
    .then(() => counter.increment('bar', 2))
    .then(() => counter.increment('foo', -1))
    .then(() => counter.increment('bar', -3))
    .then(() => counter.increment('bar', 'fghj'))
    .then(() => counter.get('bar'))
    .then(result => assert(result==='2'))
    .then(() => counter.incrementAndGet('foo'))
    .then(result => assert(result==='5'))
    .then(counter.dispose)
    .then(() => console.log('caseMongodbBacked() tests are OK'))
    .catch(err => {
      console.log('* ERROR 3 *', err)      
      process.exit(-1)
    })
  })
}

caseInMemory()
caseMongodbBacked()

