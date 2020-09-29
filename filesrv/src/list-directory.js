'use strict'

const { fs } = require('./commons')
const Handler = require('./handler')

function ListDirectoryHandler(context, ioaFactory, params) {
  const self = this

  Handler.call(self, context, ioaFactory, params)

  const listDirectory = dir => {
    const dirents = []
    const f = () => dir.read((err, dirent) => {
      if (err) {
        self.errorJson('Read error', 4)
      } else if (dirent === null) {
        dir.close()
        self.jsonResponseWriter.startArray()
        dirents.forEach(self.jsonResponseWriter.flushObject)
        self.jsonResponseWriter.close()
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
    self.createJsonResponseWriter()
    if (params.allowDirectoryListing) {
      try {
        const dirPath = self.resolvePath(context.getRequestParameters().path)
        fs.opendir(dirPath, (err, dir) => err ? self.errorJson('Cannot open dir: ' + dirPath, 3) : listDirectory(dir))
      } catch (e) {
        self.errorJson('Server error: ' + e.toString(), 2)
      }
    } else {
      self.errorJson('Directory listing is not allowed', 1)
    }
  }
}

module.exports = (context, ioaFactory, params) => new ListDirectoryHandler(context, ioaFactory, params)
