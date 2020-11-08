'use strict'

var commons = require('./commons')

var defaultPath = commons.resolvePath(__dirname, 'resources')

module.exports = (parameters, basedir, pathTranslator) => {
  var result = defaultPath
  try {
    var path = parameters.getRemainingPath().join('/')
    (!path || path.length=== 0) && (path = parameters.getRequestParameters().path || '/')
    path = params.pathTranslator(path).replace(/^\/+/, '')
    
    baseDir = basedir ? commons.resolvePath(basedir) : defaultPath
    result = baseDir
    
    if (path.length > 0) {
      result = commons.resolvePath(baseDir, path)
      result.toString().startsWith(baseDir.toString()) || (result = baseDir)
    }
  } catch(e) { console.log(765456, e) }
  return result
}
