'use strict'

var fs = require('fs')
var zlib = require('zlib')
var restEndpoint = require('@permian/restendpoint')
var commons = require('./commons')

var streamFile = (contextFactory, path, contentType, isZipped) => contextFactory.emptyToStream()
  .setStatusCode(restEndpoint.http.STATUS_OK)
  .setContentType(contentType)
  .process(outstream => {
    if (isZipped) {
      var zstream = zlib.createDeflate()
      zstream.pipe(outstream)
      outstream = zstream
    }
    var readStream = fs.createReadStream(path, {}).on('error', () => outstream.end('-------FILE_READ_ERROR-------'))
    readStream.pipe(outstream)
  })

var getFileExtension = filePath => {
  var a = filePath.toString().split('.')
  return a[a.length - 1]
}

var getContentType = (path, types, isZipped) => commons.when(isZipped)
  .then('application/gzip')
  .otherwise(types[getFileExtension(path)] || restEndpoint.http.CONTENTTYPE_OCTET_STREAM)

module.exports = (contextFactory, path, isZipped, types) => fs.promises.lstat(path)
  .then(stats => stats.isFile() ? streamFile(contextFactory, path, getContentType(path, types, isZipped), isZipped) : Promise.reject())
  .catch(e => restEndpoint.tools.responseJsonError.notFound(contextFactory, JSON.stringify(e).substr(0, 80)))



