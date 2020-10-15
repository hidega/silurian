'use strict'

const commons = require('@permian/commons')

module.exports = {
  fs: commons.files.fsExtra,
  matcher: commons.lang.matcher,
  assignRecursive: commons.lang.assignRecursive,
  try: commons.lang.try
}
