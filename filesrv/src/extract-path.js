'use strict'

var commons = require('./commons')

var defaultPath = commons.resolvePath(__dirname, 'resources')

module.exports = (parameters, baseDir) => {
  var result = defaultPath
  try {
    baseDir = baseDir ? commons.resolvePath(baseDir) : defaultPath
    var path = parameters.getRemainingPath().join('/')
    if (!path || path.length === 0) {
      path = (parameters.getRequestParameters().path || '').replace(/^\/+/, '')
    }
    result = (path.length > 0) ? commons.resolvePath(baseDir, path) : baseDir
  } catch (e) {}
  return result
}
