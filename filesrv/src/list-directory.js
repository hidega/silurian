'use strict'

const { fs } = require('./commons')
const Handler = require('./handler')

function ListDirectoryHandler(context, ioaFactory, params) {
  const self = this

  Handler.call(self, context, ioaFactory, params)

  const jsonResponseWriter = ioaFactory.createJsonResponseWriter()

  const errorJson = (msg, code) => {
    if (jsonResponseWriter) {
      jsonResponseWriter.startObject()
      jsonResponseWriter.flushObject('error', {
        errorCode: code || -1,
        msg: msg && msg.toString().substr(0, 80)
      })
      jsonResponseWriter.close()
    }
  }

  const listDirectory = dir => {
    const dirents = []
    const f = () => dir.read((err, dirent) => {
      if (err) {
        errorJson('Read error', 4)
      } else if (dirent === null) {
        dir.close()
        jsonResponseWriter.startArray()
        dirents.forEach(jsonResponseWriter.flushObject)
        jsonResponseWriter.close()
      } else {
        let type = 'other'
        if (dirent.isDirectory()) {
          type = 'dir'
        } else if (dirent.isSocket()) {
          type = 'socket'
        } else if (dirent.isSymbolicLink()) {
          type = 'symlink'
        } else if (dirent.isFile()) {
          type = 'file'
        }
        dirents.push({ name: dirent.name, type })
        setImmediate(f)
      }
    })
    f()
  }

  self.handle = () => {
    if (params.allowDirectoryListing) {
      try {
        const dirPath = self.resolvePath(context.getRequestParameters().path)
        fs.opendir(dirPath, (err, dir) => err ? errorJson('Cannot open dir: ' + dirPath, 3) : listDirectory(dir))
      } catch (e) {
        errorJson('Server error: ' + e.toString(), 2)
      }
    } else {
      errorJson('Directory listing is not allowed', 1)
    }
  }
}

module.exports = (context, ioaFactory, params) => new ListDirectoryHandler(context, ioaFactory, params)
