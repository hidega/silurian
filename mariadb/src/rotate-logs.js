'use strict'

var commons = require('./commons')
var CmdAdapter = require('./cmd/adapter')

var lockFile = commons.resolvePath(commons.systemTmpDir, 'mariadb-logfile-rotator.lock')
var errorFile = commons.resolvePath(commons.systemTmpDir, 'mariadb-logfile-rotator.err')
var logfileMaxSizeMB = 32
var MB = 1000000

var writeErrorFile = e => commons.fs.writeFile(errorFile, e.toString()).catch(() => {})

var checkStat = (stat, limit) => stat.size / MB > (limit || logfileMaxSizeMB)

var rotateLogs = (lock, adapter, logCfg = adapter.getConfiguration().log) => commons.fs.stat(logCfg.generalLogFile)
  .then(stat => checkStat(stat, logCfg.generalLogfileMaxSizeMB) ? adapter.rotateGeneralLogfile() : 0)
  .catch(writeErrorFile)
  .then(() => commons.fs.stat(logCfg.errorLogfile))
  .then(stat => checkStat(stat, logCfg.errorLogfileMaxSizeMB) ? adapter.rotateErrorLogfile() : 0)
  .catch(writeErrorFile)
  .then(() => lock.release())

module.exports = cfg => commons.acquireLockfile(lockFile)
  .then((lock, adapter = new CmdAdapter(JSON.parse(cfg))) => rotateLogs(lock, adapter))
  .catch(writeErrorFile)
