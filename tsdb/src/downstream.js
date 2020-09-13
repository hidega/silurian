'use strict' 

const mongodbfw = require('@permian/mongodbfw')

function Downstream(collection, filter, onData, onEnd) { 
  const self = this
  
  mongodbfw.getServerDate(collection, (err, result) => {
    if(err) {
      onEnd(err, -1)
    } else {
      const fromNow = { _id: { $gt: mongodbfw.objectIdFromDate(result.localTime) } }
      filter && filter.$and ? filter.$and.push(fromNow) : (filter = fromNow) 
      const cursor = collection.find(filter, { tailable: true, awaitdata: true, numberOfRetries: -1 })
      cursor.stream().on('data', onData).on('end', onEnd).on('error', onEnd)
      self.close = () => cursor.close()
    }
  })

  self.close = () => {}
}

module.exports = Downstream
