'use strict'

function ParsingStage(p, eventEmitter) {
  const self = this
  const name = self.constructor.name

  const params = Object.assign({
    logger: { info: () => {}, error: () => {} }
  }, p)

  self.logger = params.logger

  self.dispose = () => {
    self.logger.info(`${name} was shut down`)
    self.fsa.halt()
    eventEmitter.removeAllListeners()
  }

  self.error = (err, rowNr) => {
    eventEmitter.emit('error', err + (rowNr ? ' - rowNr: ' + rowNr : ''))
    self.logger.error(`${name} ERROR: ${err}`)
  }
  
  self.logger.info(`${name} started`)
  
  eventEmitter.on('result', self.dispose)
  
  eventEmitter.on('error', self.dispose)
}

module.exports = ParsingStage
