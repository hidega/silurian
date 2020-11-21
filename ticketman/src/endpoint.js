'use strict'

var RestEndpoint = require('@permian/restendpoint')
var parseParams = require('./parse-params')
var SimpleTicketManager = require('./simple')

var responseOk = (contextFactory, obj) => RestEndpoint.tools.responseJsonObject(contextFactory, RestEndpoint.tools.STATUS_OK, obj)

function Endpoint(p) {}

Endpoint.start = p => {
  var params = parseParams(p)

  params.ticketManager.instance || (params.ticketManager.instance = new SimpleTicketManager(params.ticketManager))

  var handlers = RestEndpoint.prependPathToHandlers(params.ticketManager.urlBasePath, {
    GET: {
      'obtain-ticket': (parameters, contextFactory) => {
        var {userid, appctx, expires} = parameters.getRequestParameters()
        return params.ticketManager.instance.obtainTicket(userid, appctx, expires)
          .then(result => responseOk(contextFactory, { result: Buffer.from(result).toString('hex') }))
          .catch(() => RestEndpoint.tools.responseJsonNotOk(contextFactory))
      },
      'decode-ticket': (parameters, contextFactory) => {
        var buf = Buffer.from(parameters.getRequestParameters().ticket, 'hex')
        return params.ticketManager.instance.decodeTicket(buf)
          .then(ticket => responseOk(contextFactory, ticket))
          .catch(() => RestEndpoint.tools.responseJsonNotOk(contextFactory))
      }
    }
  })

  return RestEndpoint.startInstance(handlers, params.restEndpoint)
}

module.exports = Endpoint
