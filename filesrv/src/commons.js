'use strict'

const commons = require('@permian/commons')

module.exports = {
  fs: commons.files.fsExtra,
  dumpPidToFile: commons.files.dumpPidToFile,
  terminateProcess: commons.proc.terminateProcess,
  matcher: commons.lang.matcher,
  assignRecursive: commons.lang.assignRecursive,
  try: commons.lang.try
}
