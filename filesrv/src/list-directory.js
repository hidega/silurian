'use strict'

const fs = require('fs-extra')
const Handler = require('./handler')

function ListDirectoryHandler(context, ioaFactory, params) {
  const self = this

  Handler.call(self, context, ioaFactory, params)

  self.handle = () => {
    self.createJsonResponseWriter()

    const listDirectory = dirPath => {
      fs.opendir(dirPath, (err, dir) => {
        if (err) {
          self.errorJson('Cannot open dir: ' + dirPath, 3)
        } else {
          const dirents = []
          const f = () => dir.read((err, dirent) => {
            if (err) {
              self.errorJson('Read error: ' + dirPath, 4)
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
      })
    }

    if (params.allowDirectoryListing) {
      try {
        listDirectory(self.resolvePath(context.getRequestParameters().path))
      } catch (e) {
        self.errorJson('Server error: ' + e.toString(), 2)
      }
    } else {
      self.errorJson('Directory listing is not allowed', 1)
    }
  }
}

module.exports = (context, ioaFactory, params) => new ListDirectoryHandler(context, ioaFactory, params)
