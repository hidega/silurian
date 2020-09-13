'use strict'

const commons = require('@permian/commons')

const Protocol = {
  UID_KEY: 'uid',
  PAYLOAD_KEY: 'payload',
  START_INDEX_KEY: 'startIndex',
  END_INDEX_KEY: 'endIndex',
  END_INDEX_VAL: -1
}

function Producer(uid, pushData, p) {
  const self = this
  const params = Object.assign({
    maxBufferLength: 5,
    bufferedDataSizeLimit: 100*1000
  }, p)

  const buffer = []

  let bufferedDataLength = 0
  let seqNumber = 0
  let pushing = false

  const flush = (end, callback) => {
    if(pushing) {
      callback(Producer.PUSHING)
    } else {
      pushing = true
      pushData({
        [Protocol.UID_KEY]: uid,
        [Protocol.PAYLOAD_KEY]: buffer,
        [Protocol.START_INDEX_KEY]: seqNumber,
        [Protocol.END_INDEX_KEY]: end ? Protocol.END_INDEX_VAL : seqNumber + buffer.length - 1
      }, err => {
        seqNumber += buffer.length
        buffer.length = 0
        bufferedDataLength = 0
        pushing = false
        callback(err)
      })
    }
  }

  const push = (data, callback) => {
    bufferedDataLength += JSON.stringify(data).length
    buffer.push(data)
    buffer.length>params.maxBufferLength || bufferedDataLength>params.bufferedDataSizeLimit ? flush(false, callback) : callback()
  }

  const close = callback => {
    flush(true, callback)
    self.push = () => {}
  }

  self.isPushing = () => pushing

  self.push = commons.lang.promisifyIfNoCallback1(push)

  self.close = commons.lang.promisifyIfNoCallback0(close)
}

Producer.PUSHING = -1

function Consumer(c) {
  const self = this
  const consume = c
  const buffer = []

  let lastArrived = false
  let seqNumber = 0

  self.onData = data => {
    buffer.unshift(data)

    for(let i=0; i<buffer.length-1; i++) {
      buffer[i][Protocol.START_INDEX_KEY] > buffer[i+1][Protocol.START_INDEX_KEY] && ([buffer[i], buffer[i+1]] = [buffer[i+1], buffer[i]])
    }

    let finito = false
    const la = lastArrived || data[Protocol.END_INDEX_KEY]===Protocol.END_INDEX_VAL 
    lastArrived = la
    const uid = data[Protocol.UID_KEY]
    while(!finito && buffer.length>0) {
      if(buffer[0][Protocol.START_INDEX_KEY]===seqNumber) {
        const payload = buffer[0][Protocol.PAYLOAD_KEY]
        seqNumber += payload.length
        payload.forEach(d => consume(d, la && buffer.length===1, uid))
        buffer.shift()
      } else {
        finito = true
      }
    }

    self.isDone() && self.close()
  }

  self.hasData = () => buffer.length>0

  self.isDone = () => lastArrived && buffer.length===0

  self.close = callback => {
    buffer.length = 0
    self.onData = () => {}
  }
}

module.exports = {
  Consumer: Consumer,
  Protocol: Protocol,
  Producer: Producer
}
