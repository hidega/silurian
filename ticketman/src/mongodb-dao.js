'use strict'

const { isEmpty } = require('@permian/commons').lang

function MongodbDao(collection) {
  const self = this

  self.upsert = (userId, appContext, expiresEpoch, callback) => collection.updateOne({
    userId,
    appContext
  }, {
    $currentDate: {
      [MongodbDao.LAST_MODIFIED_KEY]: true },
    $set: { userId, appContext, expiresEpoch }
  }, { upsert: true }, (err, result) => callback(err, err || result._id))

  self.get = (id, callback) => collection.findOne({ _id: id }, {
    projection: { userId: 1, appContext: 1, expiresEpoch: 1 }
  }, (err, result) => callback(err || isEmpty(result) ? { err: err || 'noresult' } : false, result))
}

MongodbDao.LAST_MODIFIED_KEY = 'lastModified'

MongodbDao.createInstance = (collection, removeAfterIdleMins, callback) => {
  collection.indexes((err, result) => {
    if (err) {
      callback('index problem')
    } else {
      const idx = result.find(i => i.key[MongodbDao.LAST_MODIFIED] && i.expireAfterSeconds)
      if (idx) {
        callback(false, new MongodbDao(collection))
      } else {
        const createIndex = () => collection.createIndex({
          [MongodbDao.LAST_MODIFIED_KEY]: 1
        }, {
          expireAfterSeconds: removeAfterIdleMins * 60
        }, err => callback(err, err || new MongodbDao(collection)))
        const idx1 = result.find(i => i.key[MongodbDao.LAST_MODIFIED])
        if (idx1) {
          collection.dropIndex(idx1.name, err => err ? callback(2) : createIndex())
        } else {
          createIndex()
        }
      }
    }
  })
}

module.exports = MongodbDao

// "the expiration threshold is the indexed field value plus the specified number of seconds."
