'use strict'

const FileServer = require('@silurian/filesrv')
const helloworld = require('./helloworld')
const cfg = require('./configuration')

const checkFileServer = () => {
  const client = new FileServer.RestClient({ 
    url: 'http://' + cfg.fileServer.host + ':' + cfg.fileServer.port + '/' + cfg.fileServer.urlBasePath 
  })
  return client.listDirectory('/js')
}

const checkHelloWorld = () => new Promise((resolve, reject) => helloworld.ping(cfg.helloworld, err => err ? reject(err) : resolve()))

Promise.all([ checkFileServer(), checkHelloWorld() ])
.then(err => {
  console.log('OK')
  process.exit(0)
})
.catch(err => {
  console.error(err)
  process.exit(1)
})
