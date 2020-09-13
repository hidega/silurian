'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const messagebus = require('../src')

const checkError = err => err && (console.log(JSON.stringify(err, null, 2)) || assert.fail())

const assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

const startListener = () => {  
  let i = 0

  messagebus.Client.createInstance({
    testTopic1: (message) => {
      console.log(`topic: testTopic1;  message: ${message.toString()}  #${++i}`)
    },
    testTopic2: (message) => {
      console.log(`topic: testTopic2;  message: ${message.toString()}`)
    }
  }, {
    mongodb: {
      username: 'mwuser',
      password: 'mwuserpwd'
    },
    mqCollection: 'mqCollectionTest',
    database: 'middlewareNorth', 
  }, (err, client) => {
    checkError(err) 
    console.log('listener OK')
    setTimeout(() => client.close(), 2200) 
  })
}

const startPusher= () => {
  messagebus.Client.createInstance({}, {
    mongodb: {
      username: 'mwuser',
      password: 'mwuserpwd'
    },
    mqCollection: 'mqCollectionTest',
    database: 'middlewareNorth'
  }, (err, client) => {
    checkError(err) 
    console.log('pusher OK')
    client.push('testTopic1', { txt: 'Hallo!' }, checkError)
    client.push('testTopic2', { txt: 'Hallo2!' }, checkError)
    const interval1 = setInterval(() => client.push('testTopic1', { txt: 'Hallo!' }, checkError), 230)
    const interval2 = setInterval(() => client.push('testTopic2', { txt: 'Hallo2!' }, checkError), 150)
    setTimeout(() => {
      clearInterval(interval1)
      clearInterval(interval2)
      client.close()
    }, 2000)
  }) 
}

startListener()
startPusher()
