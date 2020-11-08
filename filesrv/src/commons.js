'use strict'

var commons = require('@permian/commons')

module.exports = {
  resolvePath: commons.files.resolvePath,
  when: commons.lang.when,
  matcher: commons.lang.matcher,
  assignRecursive: commons.lang.assignRecursive,
  try: commons.lang.try
}
