'use strict'

const ParsingStage = require('./parsing-stage')

function SyntacticParser(eventEmitter, p) {
  const self = this

  self.fsa = { halt: () => {} }
  
  ParsingStage.call(self, p, eventEmitter)

  const params = Object.assign({}, p)
  
  eventEmitter.on('kviEof', data => {
    self.logger.info('kviEof', data)
    eventEmitter.emit('result', {})
  })
  
  eventEmitter.on('kviWhitespace', data => {
    self.logger.info('kviWhitespace', data)
  })
    
  eventEmitter.on('kviNumber', data => {
    self.logger.info('kviNumber', data)
  })
  
  eventEmitter.on('kviInteger', data => {
    self.logger.info('kviInteger', data)
  })
  
  eventEmitter.on('kviRightParen', data => {
    self.logger.info('kviRightParen', data)
  })
  
  eventEmitter.on('kviLeftParen', data => {
    self.logger.info('kviLeftParen', data)
  })
  
  eventEmitter.on('kviParameter', data => {
    self.logger.info('kviParameter', data)
  })
  
  eventEmitter.on('kviQuotedString', data => {
    self.logger.info('kviQuotedString', data)
  })
  
  eventEmitter.on('kviKeyword', data => {
    self.logger.info('kviKeyword', data)
  })  
}

SyntacticParser.createInstance = (eventEmitter, params) => new SyntacticParser(eventEmitter, params)

module.exports = SyntacticParser
