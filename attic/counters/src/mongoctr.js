'use strict'

const commons = require('@permian/commons')
const mongodbfw = require('@permian/mongodbfw')
const Counters = require('./counters')

function MongoDbCounters(collection, shutdown, params) {
  const self = this

  const shardIds = {}

  const resetShards = (counterName , callback) => collection.deleteMany({
    [MongoDbCounters.keys.NAME]: counterName || MongoDbCounters.defaultName
  }, err => {
    if(err) {
      callback(err)
    } else {
      counterName || (counterName = MongoDbCounters.defaultName)
      const data = Array(params.shardsPerCounter)
      for(let i=0; i<data.length; i++) {
        data[i] = {
          _id: mongodbfw.uniqueObjectId(),
          [MongoDbCounters.keys.NAME]: counterName,
          [MongoDbCounters.keys.VALUE]: mongodbfw.longFromNumber(0)
        }
      }
      collection.insertMany(data, (err, result) => {
        if(err) {
          callback(err)
        } else {
          shardIds[counterName] = Object.values(data.map(d => d._id))
          callback(false, shardIds[counterName])
        }
      })
    }
  })

  const fetchOrCreateShardIds = (counterName, callback) => {
    counterName || (counterName = MongoDbCounters.defaultName)
    if(shardIds[counterName]) {
      callback(false, shardIds[counterName])
    } else {
      collection.find({ [MongoDbCounters.keys.NAME]: counterName }, { _id: 1 }).toArray((err, data) => {
        if(err) {
          callback(err)
        } else if(!data.length) {
          resetShards(counterName, callback)
        } else if(data.length!==params.shardsPerCounter) {
          callback('ERR 210 - inconsistent shard count')
        } else {
          shardIds[counterName] = data.map(e => e._id)
          callback(false, shardIds[counterName])
        }
      })
    }
  }

  const methods = {
    reset: (counterName, callback) => {
      delete shardIds[counterName || MongoDbCounters.defaultName]
      resetShards(counterName, err => callback(err))
    },
    increment: (counterName, val, callback) => fetchOrCreateShardIds(counterName, (err, shardIds) => {
      isNaN(val) && (val = 1)
      if(err) {
        callback(err)
      } else {
        const shardId = shardIds[parseInt(shardIds.length*Math.random())]
        collection.updateOne({
          _id: shardId
        }, {
          $inc: { [MongoDbCounters.keys.VALUE]: mongodbfw.longFromNumber(parseInt(val)) }
        }, err => callback(err))
      }
    }),
    get: (counterName, callback) => fetchOrCreateShardIds(counterName, err => {
      if(err) {
        callback(err)
      } else {
        collection.find({
          [MongoDbCounters.keys.NAME]: counterName || MongoDbCounters.defaultName
        }, {
          _id: 0,
          [MongoDbCounters.keys.NAME]: 0
        }).toArray((err, arr) => callback(err, err ? err : arr.reduce((acc, s) => acc + BigInt(s[MongoDbCounters.keys.VALUE]), BigInt(0)).toString()))
      }
    }),
    incrementAndGet: (counterName, val, callback) => methods.increment(counterName, val, err => err ? callback(err) : methods.get(counterName, callback))
  }

  Counters.call(self, methods)

  self.dispose = () => {
    shutdown()
    commons.lang.disableDeclaredFunctions(self)
  }
}

MongoDbCounters.keys = Object.freeze({
  NAME: 'cname',
  VALUE: 'val'
})

MongoDbCounters.defaultName = 'defaultctr'

module.exports = Object.freeze(MongoDbCounters)
