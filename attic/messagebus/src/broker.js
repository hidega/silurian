'use strict'

const commons = require('@permian/commons')

function Broker(p) {
  const self = this
  const params = Object.assign({
    maxPendingSubscriptions: 10*1000 
  }, p)

  let subscriptions = {}

  self.processMessage = (data, uid) => {
    if(uid && subscriptions[uid]) {      
      const keepSubscription = subscriptions[uid](false, data, uid)
      keepSubscription || self.unsubscribe(uid)
    }
  }

  self.unsubscribe = uid => delete subscriptions[uid]

  self.subscribe = (handler, opts) => {
    opts || (opts = {})
    let uid = Broker.TOO_MANY_SUBSCRIPTIONS
    if(Object.keys(subscriptions).length<params.maxPendingSubscriptions) {
      uid = opts.uid || Broker.uid()
      subscriptions[uid] = handler
      opts.timeout && setTimeout(() => {
        self.unsubscribe(uid)
        handler(Broker.TIMEOUT)
      }, opts.timeout)
    }
    return uid
  }

  self.dispose = () => {
    subscriptions = false
    self.subscribe = () => {}
    self.processMessage = () => {}
  }
}

Broker.TIMEOUT = -2
Broker.TOO_MANY_SUBSCRIPTIONS = -1

Broker.uid = () => commons.proc.uuid()

module.exports = Broker 