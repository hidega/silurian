'use strict'

const startInstance = require('./start-instance')
const prependPathToHandlers = require('./prepend-path')

function Server() {}

Server.startInstance = startInstance

Server.safeRestartDelayMs = 3000

Server.prependPathToHandlers = prependPathToHandlers

module.exports = Object.freeze(Server)

