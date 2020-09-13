'use strict'

const path = require('path')
const rfs = require('rotating-file-stream')
const commons = require('@permian/commons')
const ts = require('@silurian/time-service')
const SysmonMailer = require('./mailer')
  
function Sysmon() {}

Sysmon.startInstance = (cfg, monitoringProcesses) => { 
  const config = Object.assign({
    id: 'Silurian system monitor',
    dumpPid: false,
    loggingEnabled: true,
    logfileName: 'silurian-sysmon.log',
    logfilePath: path.resolve(__dirname, '..'),                               
    logfileMaxRotatedInstances: 2,
    logfileMaxSizeMb: 10
  }, cfg)
  
  const oneMinute = 60*1000  

  const logger = config.loggingEnabled ? new commons.proc.StreamLogger(config.id, rfs(config.logfileName, {
    path: config.logfilePath,
    size: `${config.logfileMaxSizeMb}K`,  
    maxFiles: config.logfileMaxRotatedInstances
  })) : commons.proc.StdLogger.mutedInstance
  const loggerInterval = setInterval(() => logger.info('Alive'), 10*oneMinute)
  
  const mailer = config.mailAccount ? new SysmonMailer(logger, config.mailAccount) : SysmonMailer.bogusInstance
  const mailerInterval = setInterval(() => mailer.info(`${config.id} is alive`), 60*oneMinute)

  const timeMonitor = new ts.TimeMonitor()  
  const ntpInterval = setInterval(() => {   
    const localTime = Date.now()
    const universalTime = timeMonitor.now()
    Math.abs(universalTime - localTime) > 5*oneMinute && mailer.error(`Unsynchronized clock:  ${localTime} local  vs.  ${universalTime} universal`)
  }, 20*oneMinute)
  
  monitoringProcesses.forEach(p => p.start(logger, mailer))
  
  config.dumpPid && commons.files.dumpPidToFile(path.resolve(config.logfilePath, 'silurian-sysmon.pid'))
  
  commons.proc.dumpUncaughtErrors(path.resolve(config.logfilePath, 'uncaught-error.txt'), true)
  
  return () => {
    clearInterval(loggerInterval)
    clearInterval(mailerInterval)
    clearInterval(ntpInterval)
    monitoringProcesses.forEach(p => p.stop())
  }
}

module.exports = Object.freeze(Sysmon)

