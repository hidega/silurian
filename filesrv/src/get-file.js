'use strict'

var fs = require('fs')
var commons = require('./commons')
var mimeTypes = require('./ext-mtype')
var Handler = require('./handler')

function GetFileHandler(contextFactory, params) {
  Handler.call(this, params)

  this.getFileExtension = filePath => {
    var a = filePath.toString().split('.')
    return a[a.length - 1]
  }

  var error = httpResposeCode => {
    var writer = ioaFactory.createBinaryResponseWriter({
      httpResposeCode,
      contentType: 'text/plain'
    })
    writer.write('NOTFOUND')
    writer.close()
  }

  var streamFile = (filePath, contentType) => {
    var writeError = writer => {
      writer.write(Buffer.from('-------FILE_READ_ERROR-------'))
      writer.close()
    }
    var gzipped = this.isGzipped(context.getRequestParameters())
    var writer = ioaFactory.createBinaryResponseWriter({
      gzipped,
      contentType: gzipped ? 'application/gzip' : contentType,
      httpResposeCode: 200
    }, event => event === 'error' && writeError(writer))
    var readStream = fs.createReadStream(filePath, {}).on('error', () => writeError(writer))
    readStream.pipe(writer.getOutputStream())
  }

  this.handle = () => commons.try(() => {
    var filePath = this.resolvePath(context.getRequestParameters().path || context.getRemainingPath().slice(1).join('/'))
    var contentType = Object.assign(mimeTypes, params.additionalTypeMappings)[this.getFileExtension(filePath)] || 'application/octet-stream'
    fs.lstat(filePath, (err, stats) => err || !stats.isFile() ? error(404) : streamFile(filePath, contentType))
  }, () => error(500))
}

module.exports = (context, ioaFactory, params) => new GetFileHandler(context, ioaFactory, params)
