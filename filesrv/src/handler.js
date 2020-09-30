'use strict'

const path = require('path')

function Handler(context, ioaFactory, params) {
  const self = this

  self.baseDir = params.basedir ? path.resolve(params.basedir) : path.resolve(__dirname, '..', 'files')

  self.getFileExtension = filePath => {
    const a = filePath.toString().split('.')
    return a[a.length - 1]
  }

  self.resolvePath = p => {
    p || (p = '/')
    p = params.pathTranslator(p).trim().replace(/^\/+/, '')
    let result = self.baseDir
    if (p.length > 0) {
      result = path.resolve(self.baseDir, p)
      if (!result.toString().startsWith(self.baseDir.toString())) {
        result = self.baseDir
      }
    }
    return result
  }

  self.isGzipped = reqParams => reqParams.zipped && (reqParams.zipped === '1' || reqParams.zipped === 'true' || reqParams.zipped === 'yes')
}

module.exports = Handler
