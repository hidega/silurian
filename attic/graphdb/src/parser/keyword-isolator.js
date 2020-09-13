'use strict'

const ParsingStage = require('./parsing-stage')

function KeywordIsolator(eventEmitter, p) {
  const self = this
  const keywords = [ 
    'select', 
    'nodes',
    'edges',
    'where',
    'id',
    'label',
    'domain',
    'like',
    'limit'
  ]
  
  let parenBalance = 0

  ParsingStage.call(self, p, eventEmitter)

  const params = Object.assign({}, p)
    
  self.fsa = { halt: () => {} }

  eventEmitter.on('lexString', data => data.val.replace(/\(/g, ' ( ')
                                               .replace(/\)/g, ' ) ')
                                               .trim()
                                               .replace(/[ ]+/g, ' ')
                                               .split(' ')
                                               .find(str => {      
    let result = false
    
    const fwdData = Object.assign(data, { val: str })
    
    const error = msg => {
      self.error(msg + ': ' + str, fwdData.rowNr)
      result = true
    }
    
    if(str==='(') {
      parenBalance++
      eventEmitter.emit('kviLeftParen', fwdData)
    } else if(str===')') {
      parenBalance--
      parenBalance<0 ? error('Extra right paren') : eventEmitter.emit('kviRightParen', fwdData)
    } else if(str.startsWith('"')) {
      if(str.endsWith('"')) {
        fwdData.val = fwdData.val.substr(1, fwdData.val.length-2)
        eventEmitter.emit('kviQuotedString', fwdData) 
       } else {
         error('Malformed token') 
       }
    } else if(str.startsWith('$')) {
      /^\$[A-Za-z][A-Za-z0-9_]*$/g.test(str) ? eventEmitter.emit('kviParameter', fwdData) : error('Illegal parameter name') 
    } else if(keywords.includes(str)) {
      eventEmitter.emit('kviKeyword', fwdData)
    } else {
      error('Unexpected literal')       
    }
    return result
  }))

  eventEmitter.on('lexEof', data => {
    if(parenBalance!==0) {
      self.error(`Missing ${parenBalance<0 ? 'left' : 'right'} paren`, data.rowNr)
    } else {
      eventEmitter.emit('kviEof', data)
    }
  })
  
  eventEmitter.on('lexWhitespace', data => eventEmitter.emit('kviWhitespace', data))
    
  eventEmitter.on('lexNumber', data => eventEmitter.emit('kviNumber', data))
  
  eventEmitter.on('lexInteger', data => eventEmitter.emit('kviInteger', data))
}

KeywordIsolator.createInstance = (eventEmitter, params) => new KeywordIsolator(eventEmitter, params)

module.exports = KeywordIsolator
