'use strict'

function JsonWriter(stream, opts) {
  const self = this 

  let stack = []
  let prev = false
  let started = false

  const write = data => stream.write(data)
  
  const toSztring = str => !str ? null : str.replace(/\"/g, `\"`)

  const withinArray = () => stack[stack.length-1]===']'

  const writeWithPrev = str => {
    const comma = prev ? ',' : ''
    prev = true    
    return write(`${comma}${str}`)
  }

  self.startObject = key => {
    let result
    if(started) {      
      result = write(`${prev ? ',' : ''}` + (withinArray() ? '{' : `"${toSztring(key)}":{`))
    } else {
      started = true
      result = write('{')
    }
    prev = false
    stack.push('}')
    return result
  }

  self.closeObject = () => {
    let result
    if(stack[stack.length-1]!=='}') {
      throw new Error('Cannot close object')
    }
    result = write('}')
    prev = true
    stack.pop()
    return result
  }

  self.startArray = key => {
    let result
    if(started) {
      result = write(`${prev ? ',' : ''}` + (withinArray() ? '[' : `"${toSztring(key)}":[`))
    } else {
      started = true
      result = write('[')
    }
    prev = false
    stack.push(']')
    return result
  }

  self.closeArray = () => {
    let result
    if(stack[stack.length-1]!==']') {
      throw new Error('Cannot close array')
    }
    result = write(']')
    prev = true
    stack.pop()
    return result
  }

  self.flushObject = (key, obj) => writeWithPrev(withinArray() ? JSON.stringify(key) : `"${toSztring(key)}":${JSON.stringify(obj)}`)

  self.writeNumber = (key, val) => writeWithPrev(withinArray() ? Number(key).toString() : `"${toSztring(key)}":${Number(val).toString()}`)

  self.writeBoolean = (key, val) => writeWithPrev(withinArray() ? !!key : `"${toSztring(key)}":${!!val}`)

  self.writeString = (key, val) => writeWithPrev(withinArray() ? `"${toSztring(key)}"` : `"${toSztring(key)}":"${toSztring(val)}"`)

  self.appendString = (key, val) => { throw new Error('not implemented') }

  self.writeNull = key => writeWithPrev(withinArray() ? 'null' : `"${toSztring(key.toString())}":null`)

  self.close = () => stack.reverse().forEach(write) 
}

module.exports = JsonWriter