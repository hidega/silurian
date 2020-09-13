'use strict'

const mongodbfw = require('@permian/mongodbfw')
const {lang} = require('@permian/commons')
const MongoDbCounters = require('./mongoctr')
const validatorSchema = require('./validator-schema')

const startInstance = (p, callback) => {
  const parameters = lang.assignRecursive({
    shardsPerCounter: 32,
    id: 'Counters',
    collectionName: 'counters',
    databaseName: 'countersDb'
  }, p)

  const mongodbConnector = new mongodbfw.Connector(parameters.mongodb)

  const ccParams = {
    createCollection: (db, cb) => db.createCollection(parameters.collectionName, {
      validator: { $jsonSchema: validatorSchema },
    }, (err, collection) => {
      if(err) {
        cb(err)
      } else {
        collection.createIndex({ [MongoDbCounters.keys.NAME]: 1 }, { unique: false }, err => cb(err, err ? 1 : collection))
      }
    }),
    collectionName: parameters.collectionName,
    databaseName: parameters.databaseName,
    onSuccess: collection => new MongoDbCounters(collection, mongodbConnector.shutdown, parameters),
    mongodbConnector
  }
  mongodbfw.getOrCreateCollection(ccParams, (err, result) => {
    err && mongodbConnector.shutdown()
    callback(err, err ? 1 : result)
  })
}

module.exports = startInstance
