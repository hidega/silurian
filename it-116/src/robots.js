'use strict'

const path = require('path')
const fs = require('fs-extra')
const cfg = require('./configuration')

const exit = (code, msg) => {
  console.error(code, msg)
  process.exit(code)
}

function Robot(id, l) {
  const self = this
  const ticketTimeoutMs = 2000
  
  const log = (code, msg) => l(code, msg.substr(0, 255) + ' - robot: ' + id)
  
  let state = false 
  
  let kvpCounter = 0
   
  const states = {
    Start: {
      delta: () => {
        log(0, 'robot was started')
        state = states.Initial
        delta()
      }
    },
    Initial: {
      delta: () => {
        setRndTimeout(rnd => {
          /*
          handleError = code => err => {
            log(code, err)
            setRndTimeout(state.delta)
          }
          if(rnd<0.5) {            
            obtainTicket()
            .then(ticket => {
              state = states.WaitForTicket
              state.delta(ticket)
            })
            .catch(err => {
              log(104, err)
              setRndTimeout(state.delta)
            }) 
          } else if(rnd<0.75) {
            renewInvalidTicket().then(state.delta).catch(handleError(105))             
          } else {
            getMainPageWithInvalidTicket().then(state.delta).catch(handleError(106))         
          }
          */
        })
      }
    },
    halt: {}
  }
  
  state = states.Start
  
  log(0, 'robot was created')
  
  self.start = () => state.delta()
}

const robotCount = 100
const logfile = path.resolve(cfg.workDir, './../../work/robots.log')

fs.remove(logfile)
.then(() => fs.ensureFile(logfile))
.then(() => {
  const log = (code, message) => fs.appendFile(logfile, 
                                               `${new Date().toISOString()} - ${code} - ${message}\n`, 
                                               err => err && exit(-2, err))  
  log(0, 'session started at')

  for(let i=0; i<robotCount; i++) {
    const r = new Robot('R' + i, log)
    r.start()
  }
})
.catch(err => exit(-1, err))

setTimeout(() => {}, 5000)
