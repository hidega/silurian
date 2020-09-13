'use strict'

const Sysmon = require('../src')

const caseDefault = () => {
  const monitoringProcessA = {
    start: (logger, mailAccount) => { 
      logger.info('monitoringProcessA started')      
      setInterval(() => {
        for(let i=0; i<10; i++) {
          logger.info('monitoringProcessA is alive')
        }
      }, 500)
    },
    stop: () => {}    
  }
  
  Sysmon.startInstance({}, [monitoringProcessA])
}

caseDefault()

