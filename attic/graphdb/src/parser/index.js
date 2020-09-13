'use strict'

const EventEmitter = require('events')
const Lexer = require('./lexer')
const KeywordIsolator = require('./keyword-isolator')
const SyntacticParser = require('./syntactic-parser')

const parse = (d, p, callback) => {
  const CHAR_BOUNDARY = 31
  
  const TAB = 9
  const NEWLINE = 10

  const params = Object.assign({
    maxQueryLength: 10000
  }, p)

  if(d.length<1 || d.length>params.maxQueryLength) {
    callback('Query is too long or too short')
  } else {
    const eventEmitter = new EventEmitter()
    Lexer.createInstance(eventEmitter, params)
    KeywordIsolator.createInstance(eventEmitter, params)
    SyntacticParser.createInstance(eventEmitter, params)

    const data = Buffer.from(d, 'ascii')

    let error = false

    eventEmitter.on('result', result => callback(false, result))

    eventEmitter.on('error', err => {
      error = err
      callback(error)
      eventEmitter.removeAllListeners()
    })

    const processData = i => { 
      if(!error) {
        if(++i===data.length) {
          eventEmitter.emit('srcEof', i)
        } else if(data[i]<=CHAR_BOUNDARY && data[i]!==TAB && data[i]!==NEWLINE) {
          eventEmitter.emit('error', 'Invalid character: ' + data[i] + ' at position ' + i)
          callback(error)
        } else {
          eventEmitter.emit('srcChar', data[i], i)
          setImmediate(() => processData(i))
        }
      }
    }

    processData(-1)
  }
}

module.exports = parse
