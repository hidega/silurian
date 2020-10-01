'use strict'

const proxy = require('@permian/proxy')
const pki = require('./pki')
const proxyCfg = require('./cfg')

const start = () => {
  proxyCfg.ssl.key = pki.getServerSslKey()
  proxyCfg.ssl.cert = pki.getServerSslCert()
  proxy.startInstance(proxyCfg)
}

const healthcheck = () => proxy.healthcheck(proxyCfg)

process.argv[1] && process.argv[1]==='healthcheck' ? healthcheck(proxyCfg, err => process.exit(err ? 1 : 0)) : start()
