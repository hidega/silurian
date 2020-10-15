'use strict'

var commons = require('./commons')
var mimeTypes = require('./ext-mtype')
var Handler = require('./handler')

var chunkSize = 1000 * 256

function GetFileHandler(context, ioaFactory, params) {
  Handler.call(this, context, ioaFactory, params)

  var error = httpResposeCode => {
    var writer = ioaFactory.createBinaryResponseWriter({
      httpResposeCode,
      contentType: 'text/plain'
    })
    writer.write('NOTFOUND')
    writer.close()
  }

  var readFile = (fd, contentType) => {
    var writerError = 0
    var gzipped = this.isGzipped(context.getRequestParameters())
    var writer = ioaFactory.createBinaryResponseWriter({
      gzipped,
      contentType: gzipped ? 'application/gzip' : contentType,
      httpResposeCode: 200
    }, event => writerError |= Number(event === 'error'))
    var f = () => commons.fs.read(fd, Buffer.alloc(chunkSize), 0, chunkSize, null, (err, bytesRead, buf) => commons.matcher()
      .on(!writerError && err, () => {
        writer.write(Buffer.from('-------FILE_READ_ERROR-------'))
        writer.close()
      })
      .on(!writerError && bytesRead > 0, () => {
        writer.write(buf.subarray(0, bytesRead))
        setImmediate(f)
      })
      .on(!writerError, () => writer.close())
      .end())
    f()
  }

  var openFile = (filePath, contentType) => commons.fs.open(filePath, 'r', (err, fd) => err ? error(404) : readFile(fd, contentType))

  this.handle = () => commons.try(() => {
    var remainingPath = context.getRemainingPath()
    remainingPath[remainingPath.length - 1] = remainingPath[remainingPath.length - 1].split('?')[0]
    var filePath = this.resolvePath(remainingPath.slice(1).join('/'))
    var contentType = Object.assign(mimeTypes, params.additionalTypeMappings)[this.getFileExtension(filePath)] || 'application/octet-stream'
    commons.fs.lstat(filePath, (err, stats) => err || stats.isDirectory() ? error(404) : openFile(filePath, contentType))
  }, () => error(500))
}

module.exports = (context, ioaFactory, params) => new GetFileHandler(context, ioaFactory, params)
