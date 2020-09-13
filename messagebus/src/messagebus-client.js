'use strict'

const {lang} = require('@permian/commons')
const mongodbfw = require('@permian/mongodbfw')

function MessageBusClient(collection, parameters) {
  const self = this

  mongodbfw.getServerDate(collection, (err, result) => {
    const cursorOptions = {
      tailable: true,
      awaitdata: true,
      numberOfRetries: -1
    }

    const cursor = collection.find({
      $and: [
        { _id: { $gt: mongodbfw.objectIdFromDate(result.localTime) } },
        { [MessageBusClient.constants.TOPIC_KEY]: { $in: Object.keys(parameters.subscriptions) } }
      ]
    }, cursorOptions)

    const stream = cursor.stream()

    stream.on('data', data => parameters.subscriptions[data.topic](data.message))

    stream.on('error', err => {
      parameters.shutdown()
      parameters.onError(err, MessageBusClient.errorCodes.INTERNAL_ERROR)
    })

    stream.on('end', () => {
      parameters.shutdown()
      parameters.onError('Warning, stream was closed.', MessageBusClient.errorCodes.WARNING)
    })
    
    self.close = () => {
      stream.removeAllListeners()
      cursor.close(parameters.shutdown)
    }
  })
  
  const push = (topic, message, callback) => {
    if(parameters.topicNameMatcher.test(topic)) {
      collection.insertOne({
        [MessageBusClient.constants.MESSAGE_KEY]: message,
        [MessageBusClient.constants.TOPIC_KEY]: topic
      }, callback)
    } else {
      callback(MessageBusClient.errorCodes.BAD_TOPICNAME)
    }
  }
  
  self.push = lang.promisifyIfNoCallback2(push)
  
  self.close = () => {}
}

MessageBusClient.errorCodes = {
  OK: 0,
  WARNING: -1,
  BAD_TOPICNAME: -2,
  INTERNAL_ERROR: -3
}

MessageBusClient.constants = {
  TOPIC_KEY: 'topic',
  MESSAGE_KEY: 'message'
}

module.exports = Object.freeze(MessageBusClient)
