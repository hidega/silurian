'use strict' 

const mongodbfw = require('@permian/mongodbfw')
const {lang} = require('@permian/commons')
const Downstream = require('./downstream')
const validatorSchema = require('./validator-schema')

function Connector() {}

Connector.Constants = Object.freeze({
  FLAG_KEY: 'flag',
  TAG_KEY: 'tag',
  DATA_KEY: 'data'
})

function ConnectorImpl(collection, dbId, shutdown) {
  const self = this

  const putSome = (arr, callback) => collection.insertMany(arr.map(entry => {
    entry[Connector.Constants.FLAG_KEY] = mongodbfw.intFromNumber(parseInt(entry[Connector.Constants.FLAG_KEY]) || 0)
    return entry
  }), callback)

  const aggregate = (pipeline, options, callback) => collection.aggregate(pipeline, options, callback)

  const setFlag = (filter, flag, callback) => collection.bulkWrite([{
    updateMany: {
      filter,
      update: { $set: { [Connector.Constants.FLAG_KEY]: mongodbfw.intFromNumber(parseInt(flag) || 0) } }
    }
  }], callback)

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

  const restoreDatabase = (upstream, callback) => {}

  const provideWithTimestamp = onData => (entry => onData(Object.assign(entry, { timestamp: entry._id.getTimestamp().valueOf() } )))

  self.diagnostics = lang.promisifyIfNoCallback0(diagnostics)

  self.putSome = lang.promisifyIfNoCallback1(putSome)

  self.put = lang.promisifyIfNoCallback1((entry, callback) => putSome([entry], callback))

  self.find = (filter, onData, onEnd) => collection.find(filter, {}).forEach(provideWithTimestamp(onData), onEnd)

  self.findAndProject = (filter, projection, onData, onEnd) => collection.find(filter, { projection }).forEach(provideWithTimestamp(onData), onEnd)

  self.aggregate = lang.promisifyIfNoCallback2(aggregate)

  self.setFlag = lang.promisifyIfNoCallback2(setFlag)

  self.getDownstream = (filter, onData, onEnd) => new Downstream(collection, filter, onData, onEnd)

  self.dumpDatabase = (onData, onEnd) => collection.find({}).forEach(onData, onEnd)

  self.shutdown = shutdown

  self.restoreDatabase = lang.promisifyIfNoCallback1(restoreDatabase)
}

const createInstance = (params, callback) => {
  const parameters = Object.assign({
    collectionName: 'tsdbData',
    databaseName: 'tsdb',
    id: 'Silurian TSDB',
    maxDbSize: 100*1000*1000
  }, params)

  const mongodbConnector = new mongodbfw.Connector(parameters.mongodb)

  const ccParams = {
    createCollection: (db, cb) => db.createCollection(params.collectionName, {
      validator: { $jsonSchema: validatorSchema },
      capped: true,
      size: parameters.maxDbSize
    }, cb),
    collectionName: parameters.collectionName,
    databaseName: parameters.databaseName,
    onSuccess: collection => new ConnectorImpl(collection, parameters.id, mongodbConnector.shutdown),
    mongodbConnector
  }
  mongodbfw.getOrCreateCollection(ccParams, (err, result) => {
    err && mongodbConnector.shutdown()
    callback(err, err ? 1 : result)
  })
}

Connector.createInstance = lang.promisifyIfNoCallback1(createInstance)

module.exports = Object.freeze(Connector)
