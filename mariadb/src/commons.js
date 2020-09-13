'use strict'

const commons = require('@permian/commons')

module.exports = {
  fs: commons.files.fsExtra,
  resolvePath: commons.files.resolvePath,
  sleep: commons.lang.sleep,
  assignRecursive: commons.lang.assignRecursive,
  getUid: commons.platform.getUid,
  getGid: commons.platform.getGid,
  throwError: commons.lang.throwError
}
