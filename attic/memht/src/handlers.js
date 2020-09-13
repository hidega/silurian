'use strict' 

const {lang} = require('@permian/commons')
const restendpoint = require('@permian/restendpoint')
 
function Handlers(hashtable) {
  const self = this

  self.getObjects = (context, ioaFactory) => {
    let f = () => {}
    const writer = new ioaFactory.createJsonResponseWriter(e => e==='drain' && f())
    let keys = context.getRequestParameter('keys')
    if(keys) {
      f = () => {
        if(keys.length>0) {
          const key = keys.pop()
          const buf = hashtable.get(key)
          let value = false
          try {
            value = JSON.parse(buf.toString())
          } catch(e) {
            value = buf.toString('base64')
          }
          const drain = !writer.flushObject({ key, value })
          drain || setImmediate(() => f(keys))
        } else {
          writer.close()
        }
      }
      writer.startObject() 
      f()
    } else {
      writer.flushObject({ error: 'Keys must be set'})
      writer.close()
    }    
  }

  self.getRaw = (context, ioaFactory) => restendpoint.tools.SimpleJsonWriter.flushError(ioaFactory, 'Not implemented')

  self.putObjects = (context, ioaFactory) => {
    const writer = new restendpoint.tools.SimpleJsonWriter(ioaFactory)
    const processor = ioaFactory.createJsonRequestProcessor()
    ioaFactory.createJsonRequestReader(false, processor.getHandlers(), (event, data) => {
      if(event==='end') {
        try {
          const obj = processor.getObject()
          if(!lang.isObject(obj)) {
            throw new Error('Parameter is not object')
          }
          const data = Object.keys(obj).reduce((acc, key) => Object.defineProperty(acc, key, { value: Buffer.from(JSON.stringify(obj)) }), {})
          writer.flushResult(!!hashtable.putMany(data))
        } catch(e) {
          writer.flushError(e)
        }
      } else if(event==='error') {
        writer.flushError('parsing error')
      }
    })
  }

  self.putRaw = (context, ioaFactory) => restendpoint.tools.SimpleJsonWriter.flushError(ioaFactory, 'Not implemented')
}

module.exports = Handlers
