'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const mongodbfw = require('@permian/mongodbfw')
const tsdb = require('../src')

const checkError = err => err && (console.log(JSON.stringify(err, null, 2)) || assert.fail())

const echo = str => console.log('- ', str)

const assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

const caseCombined = () => {
  const params = {
    collectionName: 'tsdbtest',
    databaseName: 'testdb',
    mongodb: {
      username: 'superuser',
      password: 'superuser'
    }
  }
  tsdb.Connector.createInstance(params, (err, connector) => {
    checkError(err)
    connector.diagnostics()
    .then(() => connector.put({ data: { value: 1 } }))
    .then(() => connector.put({ tag: 'important', data: { value: -1 } }))
    .then(() => connector.putSome([
      { data: { value: 2 } },
      { flag: 0, tag: 'important', data: { value: 3 } }
    ]))
    .then(() => {
      const query = new tsdb.QueryBuilder()
      .setFromDate('2018-10-30')
      .setTags(['important'])
      .build()
      return connector.setFlag(query, -127)
    })
    .then(() => {
      const query = new tsdb.QueryBuilder()
      .setTags(['important'])
      .build()
      connector.find(query, console.log, checkError)
      return 1
     })
    .then(() => {})
    .catch(checkError)
    .finally(() => connector.shutdown())
  })
}

const caseQueryBuilder = () => {
  const query = new tsdb.QueryBuilder()
  .setFromDate('2018-10-30')
  .setUntilDate('2019-04-30')
  .setTags(['tag1', 'tag2'])
  .setFlags([1, 2, 3])
  .build()
  assertEquals(query, {
    $and: [{
      _id: {
          $gte: mongodbfw.objectIdOf('5bd79f000000000000000000')
        }
      }, {
        _id: {
          $lte: mongodbfw.objectIdOf('5cc790000000000000000000')
        }
      }, {
        flag: {
          $in: [1, 2, 3]
        }
      }, {
        tag: {
          $in: ['tag1', 'tag2']
        }
      }
    ]
  })
}

caseCombined()
caseQueryBuilder()
