'use strict'

var path = require('path')

function Handler(context, ioaFactory, params) {
  this.baseDir = params.basedir ? path.resolve(params.basedir) : path.resolve(__dirname, '..', 'files')

  this.getFileExtension = filePath => {
    var a = filePath.toString().split('.')
    return a[a.length - 1]
  }

  this.resolvePath = p => {
    p || (p = '/')
    p = params.pathTranslator(p).trim().replace(/^\/+/, '')   
    var result = this.baseDir
    if (p.length > 0) {
      result = path.resolve(this.baseDir, p)
      result.toString().startsWith(this.baseDir.toString()) || (result = this.baseDir)
    }
    return result
  }

  this.isGzipped = reqParams => reqParams.zipped && (reqParams.zipped === '1' || reqParams.zipped === 'true' || reqParams.zipped === 'yes')
}

module.exports = Handler
