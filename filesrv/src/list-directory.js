'use strict'

var fs = require('fs')
var restEndpoint = require('@permian/restendpoint')
var commons = require('./commons')

var listDirectory = (contextFactory, path) => fs.promises.readdir(path, { withFileTypes: true })
  .then(entries => contextFactory.emptyToBuffer()
    .setStatusCode(restEndpoint.http.STATUS_OK)
    .setContentType(restEndpoint.http.CONTENTTYPE_JSON)
    .process(() => entries.map(e => {
        var type = commons.matcher()
          .on(e.isDirectory(), 'dir')
          .on(e.isFile(), 'file')
          .otherwise('other')
        return { name: e.name, type }
      })
      .filter(e => e.type !== 'other')))
  .catch(e => restEndpoint.tools.responseJsonError.serverError(contextFactory, JSON.stringify(e).substr(0, 80)))

module.exports = (contextFactory, path, allowListing) => commons.when(allowListing)
  .then(() => listDirectory(contextFactory, path))
  .otherwise(() => restEndpoint.tools.responseJsonError.forbidden(contextFactory, 'Directory listing is not allowed'))
