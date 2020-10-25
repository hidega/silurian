'use strict'

const RestEndpoint = require('@permian/restendpoint')
const ticketman = require('@silurian/ticketman')
const userdb = require('@silurian/userdb')
const memht = require('@silurian/memht')
const timeService = require('@silurian/time-service')
const renderMainPage = require('./main-page')
const cfg = require('./configuration')

const flushHttpError = RestEndpoint.tools.flushHttpError
const flushHtml = RestEndpoint.tools.flushHtml
const flushJsonError = RestEndpoint.tools.SimpleJsonWriter.flushError
const flushJsonResult = RestEndpoint.tools.SimpleJsonWriter.flushResult

const startServlet = params => {
  const ticketTimeoutMs = cfg.servlet.ticketTimeoutMs

  const timeServiceClient = new timeService.RestClient({ url: 'http://' + cfg.timeService.host + ':' + cfg.timeService.port })

  const memhtClient = new memht.RestClient({ url: 'http://' + cfg.memht.host + ':' + cfg.memht.port + '/memht' })

  const userDatabase = new userdb.StaticUserdatabase(cfg.userDb.usersFile)

  const ticketManager = new ticketman.SimpleTicketManager(cfg.ticketManager)

  const dateNow = () => timeServiceClient.getStoredTime()

  const ticketStrToBuf = str => Buffer.from(str || '', 'hex')

  const ticketBufToStr = buf => buf ? buf.toString('hex') : ''

  const checkTicket = ts => new Promise((resolve, reject) => {
    const now = dateNow()
    if(now===-1) {
      reject(500)
    } else {
      ticketManager.decodeTicket(ticketStrToBuf(ts), (err, ticket) => {
        if(err) {
          reject(401)
        } else if(ticket.expiresEpoch > now) {
          userDatabase.find(ticket.userId, data => {
            if(data.length===1) {
              resolve({
                ticketStr: ts,
                userdbEntry: data[0],
                ticket
              })
            } else {
              reject(403)
            }
          })
        } else {
          reject(408)
        }
      })
    }
  })

  const handleMainPage = (context, ioaFactory) => checkTicket(context.getRequestParameters().ticket)
  .then(result => flushHtml(ioaFactory, renderMainPage({
    user: result.ticket.userId,
    ticket: result.ticketStr
  })))
  .catch(err => flushHttpError(ioaFactory, err))

  const flushTicket = (ioaFactory, username) => {
    const now = dateNow()
    if(now===-1) {
      flushJsonError(ioaFactory, 500)
    } else {
      ticketManager.obtainTicket(username, 'it116', now + ticketTimeoutMs)
      .then(ticket => flushJsonResult(ioaFactory, ticketBufToStr(ticket)))
      .catch(err => flushJsonError(ioaFactory, err))
    }
  }

  const handleObtainTicket = (context, ioaFactory) => {
    const { username, password } = context.getRequestParameters()
    userDatabase.find(username, data => data.length===1 && data[0].password===password ? flushTicket(ioaFactory, username) : flushJsonError(ioaFactory, '401'))
  }

  const handleUpdateTicket = (context, ioaFactory) => checkTicket(context.getRequestParameters().ticket)
  .then(result => flushTicket(ioaFactory, result.userdbEntry.name))
  .catch(err => flushJsonError(ioaFactory, err))

  const handleFindKvp = (context, ioaFactory) => {
    const { ticket, prefix } = context.getRequestParameters()
    checkTicket(ticket)
    .then(() => memhtClient.keysLike(prefix))
    .then(result => memhtClient.getObjects(result.data))
    .then(data => flushJsonResult(ioaFactory, data))
    .catch(err => flushJsonError(ioaFactory, err))
  }

  const handleUpsertKvp = (context, ioaFactory) => context.getRequestBodyAsObject((err, data) => {
    if(err) {
      flushJsonError(ioaFactory, err)
    } else {
      checkTicket(context.getRequestParameters().ticket)
      .then(() => memhtClient.putObjects(data))
      .then(result => result.data)
      .then(data => flushJsonResult(ioaFactory, data))
      .catch(e => flushJsonError(ioaFactory, e))
    }
  })

  const handleDeletKvp = (context, ioaFactory) => {
    const { ticket, key } = context.getRequestParameters()
    checkTicket(ticket)
    .then(() => memhtClient.remove(key))
    .then(result => result.data)
    .then(data => flushJsonResult(ioaFactory, data))
    .catch(err => flushJsonError(ioaFactory, err))
  }

  const requestHandlers = RestEndpoint.prependPathToHandlers(params.urlBasePath, {
    GET: {
      'get-main-page': handleMainPage,
      'obtain-ticket': handleObtainTicket,
      'update-ticket': handleUpdateTicket
    },
    POST: {
      'find-kvp': handleFindKvp
    },
    PUT: {
      'upsert-kvp': handleUpsertKvp
    },
    DELETE: {
      'delete-kvp': handleDeletKvp
    }
  })

  return RestEndpoint.startInstance(requestHandlers, {
    id: 'Servlet',
    maxConnections: 32,
    port: params.port,
    host: params.host,
    requestTimeout: 5*1000,
    logToStdout: true
  })
}

module.exports = startServlet
