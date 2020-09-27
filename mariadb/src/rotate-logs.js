'use strict'

const commons = require('./commons')
const CmdAdapter = require('./cmd/adapter')

const lockFile = commons.resolvePath(commons.systemTmpDir, 'mariadb-logfile-rotator.lock')
const errorFile = commons.resolvePath(commons.systemTmpDir, 'mariadb-logfile-rotator.err')
const logfileMaxSizeMB = 32
const MB = 1000000

const writeErrorFile = e => commons.fs.writeFile(errorFile, e.toString()).catch(() => {})

const checkStat = (stat, limit) => stat.size / MB > (limit || logfileMaxSizeMB)

const rotateLogs = (lock, adapter, logCfg = adapter.getConfiguration().log) => commons.fs.stat(logCfg.generalLogFile)
  .then(stat => checkStat(stat, logCfg.generalLogfileMaxSizeMB) ? adapter.rotateGeneralLogfile() : 0)
  .catch(writeErrorFile)
  .then(() => commons.fs.stat(logCfg.errorLogfile))
  .then(stat => checkStat(stat, logCfg.errorLogfileMaxSizeMB) ? adapter.rotateErrorLogfile() : 0)
  .catch(writeErrorFile)
  .then(() => lock.release())

module.exports = cfg => commons.acquireLockfile(lockFile)
  .then((lock, adapter = new CmdAdapter(JSON.parse(cfg))) => rotateLogs(lock, adapter))
  .catch(writeErrorFile)
