'use strict'

const RestEndpoint = require('@permian/restendpoint')
const { assignRecursive } = require('@permian/commons').lang
const SimpleTicketManager = require('./simple')

function Endpoint(p) {}

Endpoint.start = p => {
  const params = assignRecursive({
    restEndpoint: {
      urlBasePath: 'ticketman',
      maxConnections: 32,
      port: 11290,
      host: '127.0.0.1',
      requestTimeout: 5 * 1000,
      logToStdout: false
    },
    ticketManager: {
      instance: false
    }
  }, p)

  params.ticketManager.instance || (params.ticketManager.instance = new SimpleTicketManager(params.ticketManager))

  const handlers = RestEndpoint.prependPathToHandlers(params.restEndpoint.urlBasePath, {
    GET: {
      'obtain-ticket': (context, ioaFactory) => RestEndpoint.tools.handleSafe(context, ioaFactory, writer => {
        const reqParams = context.getRequestParameters()
        params.ticketManager.instance.obtainTicket(reqParams.userid, reqParams.appctx, reqParams.expires)
          .then(result => writer.flushResult(Buffer.from(result).toString('hex')))
          .catch(() => writer.flushError(-101))
      }),
      'decode-ticket': (context, ioaFactory) => RestEndpoint.tools.handleSafe(context, ioaFactory, writer => {
        const ticket = context.getRequestParameters().ticket
        const buf = Buffer.from(ticket, 'hex')
        params.ticketManager.instance.decodeTicket(buf).then(writer.flushResult).catch(() => writer.flushError(-102))
      })
    }
  })

  return RestEndpoint.startInstance(handlers, params.restEndpoint)
}

module.exports = Endpoint
