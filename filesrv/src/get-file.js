'use strict'

const { fs } = require('./commons')
const mimeTypes = require('./ext-mtype')
const Handler = require('./handler')

const chunkSize = 1000 * 256

function GetFileHandler(context, ioaFactory, params) {
  const self = this

  Handler.call(self, context, ioaFactory, params)

  self.handle = () => {
    const error = httpResposeCode => {
      const writer = ioaFactory.createBinaryResponseWriter({
        httpResposeCode,
        contentType: 'text/plain'
      })
      writer.write('NOTFOUND')
      writer.close()
    }

    const readFile = (filePath, contentType) => fs.open(filePath, 'r', (err, fd) => {
      if (err) {
        error(404)
      } else {
        let writerError = 0
        const gzipped = self.isGzipped(context.getRequestParameters())
        const writer = ioaFactory.createBinaryResponseWriter({
          gzipped,
          contentType: gzipped ? 'application/gzip' : contentType,
          httpResposeCode: 200
        }, event => writerError |= (event === 'error' ? 1 : 0))
        const f = () => fs.read(fd, Buffer.alloc(chunkSize), 0, chunkSize, null, (err, bytesRead, buf) => {
          if (!writerError) {
            if (err) {
              writer.write(Buffer.from('-------FILE_READ_ERROR-------'))
              writer.close()
            } else if (bytesRead > 0) {
              writer.write(buf.subarray(0, bytesRead))
              setImmediate(f)
            } else {
              writer.close()
            }
          }
        })
        f()
      }
    })

    const getFile = (filePath, contentType) => fs.lstat(filePath, (err, stats) => err || stats.isDirectory() ? error(404) : readFile(filePath, contentType))

    try {
      const remainingPath = context.getRemainingPath()
      remainingPath[remainingPath.length - 1] = remainingPath[remainingPath.length - 1].split('?')[0]
      const filePath = self.resolvePath(remainingPath.slice(1).join('/'))
      const contentType = Object.assign(mimeTypes, params.additionalTypeMappings)[self.getFileExtension(filePath)] || 'application/octet-stream'
      getFile(filePath, contentType)
    } catch (e) {
      error(500)
    }
  }
}

module.exports = (context, ioaFactory, params) => new GetFileHandler(context, ioaFactory, params)
