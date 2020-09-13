'use strict'

const {lang} = require('@permian/commons')
const mongodbfw = require('@permian/mongodbfw')
const MessageBusClient = require('./messagebus-client')
const validatorSchema = require('./validator-schema')

function Client() {}

Client.errorCodes = Object.freeze(MessageBusClient.errorCodes)

Client.constants = Object.freeze({
  TOPIC_KEY: MessageBusClient.constants.TOPIC_KEY,
  MESSAGE_KEY: MessageBusClient.constants.MESSAGE_KEY,
  maxTopicNamelength: 4096,
  minTopicNamelength: 6,
  mqCollectionNameMatcher: /^[A-Za-z][A-Za-z_0-9]{5,255}$/,
  topicNameMatcher: /^[A-Za-z][A-Za-z_0-9]{5,4095}$/
})

Client.createInstance = lang.promisifyIfNoCallback2((subs, cfg, callback) => {
  const subscriptions = Object.assign({}, subs)

  const configuration = Object.assign({
    onError: (() => {}),
    mqCollection: 'messageQueue',
    messageQueueMaxSize: 100*1000*1000
  }, cfg)

  if(!Client.constants.mqCollectionNameMatcher.test(configuration.mqCollection)) {
    callback(`ERR 2 - ${configuration.mqCollection}`)
  } else if(Object.keys(subscriptions).find(key => !Client.constants.topicNameMatcher.test(key))) {
    callback('ERR 3')
  } else {
    const connector = new mongodbfw.Connector(configuration.mongodb)
    const createMessageBusClient = collection => new MessageBusClient(collection, {
      shutdown: connector.shutdown,
      subscriptions,
      topicNameMatcher: Client.constants.topicNameMatcher,
      onError: configuration.onError
    })
    const parameters = {
      collectionName: configuration.mqCollection,
      databaseName: configuration.database,
      createCollection: (db, cb) => db.createCollection(configuration.mqCollection, {
        validator: { $jsonSchema: validatorSchema },
        capped: true,
        size: configuration.messageQueueMaxSize
      }, cb),
      onSuccess: createMessageBusClient,
      mongodbConnector: connector
    }
    mongodbfw.getOrCreateCollection(parameters, (err, result) => {
      err && connector.shutdown()
      callback(err, err ? 'ERR 4' : result)
    })
  }
})

module.exports = Client
