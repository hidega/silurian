'use strict'

var restEndpoint = require('@permian/restendpoint')
var commons = require('./commons')

/*
  var listDirectory = dir => {
    var dirents = []
    var f = () => dir.read((err, dirent) => {
      if (err) {
        errorJson('Read error', 4)
      } else if (dirent === null) {
        dir.close()
        jsonResponseWriter.startArray()
        dirents.forEach(jsonResponseWriter.flushObject)
        jsonResponseWriter.close()
      } else {
        var type = commons.matcher()
          .on(dirent.isDirectory(), 'dir')
          .on(dirent.isSocket(), 'socket')
          .on(dirent.isSymbolicLink(), 'symlink')
          .on(dirent.isFile(), 'file')
          .otherwise('other')
        dirents.push({ name: dirent.name, type })
        setImmediate(f)
      }
    })
    f()
  }*/

var error = (context, msg, code) => context.setStatusCode(code)
  .setContentType(restEndpoint.http.CONTENTTYPE_JSON)
  .process(() => ({ error: (msg || '').substr(0, 80) }))

var listDirectory = (context, path) => commons.listDir(path)
  .then(entries => context.setStatusCode(restEndpoint.http.STATUS_OK)
    .setContentType(restEndpoint.http.CONTENTTYPE_JSON)
    .process(() => entries.map(e => { 
      var type = commons.matcher()
        .on(dirent.isDirectory(), 'dir') 
        .on(dirent.isFile(), 'file')
        .otherwise('other')
      return { name: e.name, type }
    })
    .filter(e => e.type !== 'other')))
  .catch(e => error(context, 'Internal error: ' + e, restEndpoint.http.STATUS_ERROR))

module.exports = (context, path, allowListing) => commons.when(allowListing)
  .then(() => listDirectory(context, path))
  .otherwise(() => error(context, 'Directory listing is not allowed', restEndpoint.http.STATUS_FORBIDDEN))
