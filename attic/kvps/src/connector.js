'use strict'

const mongodbfw = require('@permian/mongodbfw')
const {lang} = require('@permian/commons')
const validatorSchema = require('./validator-schema')

function Connector() {}

Connector.Constants = Object.freeze({
  MAX_RESULT_ARRAY_LENGTH: 256*1000,
  KEY_ATTR: 'key',
  DATA_ATTR: 'data'
})

Connector.keyStringPattern = /^[A-Za-z][A-Za-z0-9\._\-\$]{2,1024000}$/

Connector.maxKeyLength = 1024*1000

Connector.createEntry = (key, data) => ({ [Connector.Constants.KEY_ATTR]: key, [Connector.Constants.DATA_ATTR]: data })

function ConnectorImpl(collection, dbId, shutdown) {
  const self = this

  const checkKeys = (arr, callback) => {
    const result = !arr.find(obj => !Connector.keyStringPattern.test(obj.key)) 
    result || callback('Invalid key')
    return result
  }

  const keyProjection = { [Connector.Constants.KEY_ATTR]: 1, _id: 0 }

  const createLikeQuery = prefix => ({ [Connector.Constants.KEY_ATTR]: { $regex: new RegExp(`^${prefix}.*`) } })

  const createInQuery = arr => ({ [Connector.Constants.KEY_ATTR]: { $in: arr } })

  const putMany = (arr, callback) => checkKeys(arr, callback) && collection.bulkWrite(arr.map(kvp => ({
    updateOne: {
      filter: { [Connector.Constants.KEY_ATTR]: kvp[Connector.Constants.KEY_ATTR] },
      update: {
        $set: { [Connector.Constants.DATA_ATTR]: kvp[Connector.Constants.DATA_ATTR] },
        $setOnInsert: { [Connector.Constants.KEY_ATTR]: kvp[Connector.Constants.KEY_ATTR] }
      },
      upsert: true
    }
  })), {}, callback)

  const keysLike = (prefix, callback) => collection.find(createLikeQuery(prefix), {
    projection: keyProjection,
    limit: Connector.Constants.MAX_RESULT_ARRAY_LENGTH
  }).toArray(callback) 

  const removeLike = (prefix, callback) => collection.deleteMany(createLikeQuery(prefix), callback)

  const removeMany = (arr, callback) => collection.deleteMany(createInQuery(arr), callback)

  const hasMany = (arr, callback) => collection.find(createInQuery(arr), {
    projection: keyProjection,
    limit: Connector.Constants.MAX_RESULT_ARRAY_LENGTH
  }).toArray(callback) 

  const diagnostics = callback => collection.aggregate([{ 
    $collStats: { count: {} }
  }, { 
    $project : { ns: 1, localTime: 1, count: 1 } 
  }], (err, result) => callback(false, {
    entryCount: result && result.count,
    name: result && result.ns,
    localTime: result && result.localTime,
    error: err || false,
    id: dbId
  }))
  
  const restoreDatabase = (upstream, callback) => mongodbfw.upstreamData(upstream, collection, callback)

  self.getMany = (arr, onData, onEnd) => collection.find(createInQuery(arr), { projection: { _id: 0 } }).forEach(onData, onEnd)

  self.removeMany = lang.promisifyIfNoCallback1(removeMany)

  self.putMany = lang.promisifyIfNoCallback1(putMany)

  self.hasMany = lang.promisifyIfNoCallback1(hasMany)

  self.put = lang.promisifyIfNoCallback2((key, data, callback) => putMany([Connector.createEntry(key, data)], callback))

  self.get = lang.promisifyIfNoCallback3((k, onData, onEnd) => self.getMany([k], onData, onEnd))

  self.keysLike = lang.promisifyIfNoCallback1(keysLike)

  self.removeLike = lang.promisifyIfNoCallback1(removeLike)

  self.remove = lang.promisifyIfNoCallback1((k, callback) => removeMany([k], callback))

  self.has = lang.promisifyIfNoCallback1((k, callback) => hasMany([k], callback))

  self.diagnostics = lang.promisifyIfNoCallback0(diagnostics)

  self.dumpDatabase = (onData, onEnd) => collection.find({}).forEach(onData, onEnd)

  self.restoreDatabase = lang.promisifyIfNoCallback1(restoreDatabase)

  self.shutdown = shutdown
}

const createInstance = (params, callback) => {
  const parameters = Object.assign({
    databaseName: 'kvpsTestDb',
    kvpsId: 'Silurian KVPS',
    collectionName: 'tsdbData'
  }, params)

  const mongodbConnector = new mongodbfw.Connector(parameters.mongodb)

  const createCollection = (db, cb) => db.createCollection(parameters.collectionName, {
    validator: { $jsonSchema: validatorSchema }
  }, (err, collection) => {
    if(err) {
      cb(err)
    } else {
      collection.createIndex(Connector.Constants.KEY_ATTR, { unique: true }, err => cb(err, err ? 1 : collection))
    }
  })

  const ccParams = {
    createCollection,
    collectionName: parameters.collectionName,
    databaseName: parameters.databaseName,
    onSuccess: collection => new ConnectorImpl(collection, parameters.kvpsId, mongodbConnector.shutdown),
    mongodbConnector
  }
  mongodbfw.getOrCreateCollection(ccParams, (err, result) => {
    err && mongodbConnector.shutdown()
    callback(err, err ? 1 : result)
  })
}

Connector.createInstance = lang.promisifyIfNoCallback1(createInstance)

module.exports = Connector 
