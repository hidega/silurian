'use strict'

var commons = require('./commons')
var Handler = require('./handler')

function ListDirectoryHandler(context, ioaFactory, params) {
  Handler.call(this, context, ioaFactory, params)

  var jsonResponseWriter = ioaFactory.createJsonResponseWriter()

  var errorJson = (msg, code) => {
    if (jsonResponseWriter) {
      jsonResponseWriter.startObject()
      jsonResponseWriter.flushObject('error', {
        errorCode: code || -1,
        msg: msg && msg.toString().substr(0, 80)
      })
      jsonResponseWriter.close()
    }
  }

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
  }

  this.handle = () => commons.matcher()
    .on(params.allowDirectoryListing, () => commons.try(() => {
      var dirPath = this.resolvePath(context.getRequestParameters().path)
      commons.fs.opendir(dirPath, (err, dir) => err ? errorJson('Cannot open dir: ' + dirPath, 3) : listDirectory(dir))
    }, e => errorJson('Server error: ' + e.toString(), 2)))
    .otherwise(() => errorJson('Directory listing is not allowed', 1))
}

module.exports = (context, ioaFactory, params) => new ListDirectoryHandler(context, ioaFactory, params)
