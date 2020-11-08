'use strict'

var commons = require('@permian/commons')

module.exports = {
  resolvePath: commons.files.resolvePath,
  terminateProcess: commons.proc.terminateProcess,
  when: commons.lang.when,
  listDir: commons.files.listDir,
  assignRecursive: commons.lang.assignRecursive,
  try: commons.lang.try
}
