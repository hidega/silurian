'use strict'

const axios = require('axios')

function RestClient(p) {
  const self = this

  const params = Object.assign({
    url: 'http://127.0.0.1:15669/memht'
  }, p)

  self.keysLike = keyprefix => axios({
    method: 'get',
    url: params.url + '/keys-like?keyprefix=' + keyprefix
  })

  self.removeLike = keyprefix => axios({
    method: 'delete',
    url: params.url + '/remove-like?keyprefix=' + keyprefix
  })

  self.remove = key => axios({
    method: 'delete',
    url: params.url + '/remove?key=' + key
  })

  self.has = key => axios({
    method: 'get',
    url: params.url + '/has?key=' + key
  })

  self.diagnostics = () => axios({
    method: 'get',
    url: params.url + '/diagnostics'
  })

  self.getObjects = keys => axios({
    method: 'get',
    url: params.url + '/get-objects?keys=' + keys.join(',')
  })

  self.putObjects = data => axios({
    method: 'put',
    url: params.url + '/put-objects',
    data
  })

  self.putRaw = (keys, lens, buf) => axios({
    method: 'put',
    headers : { 'Content-Type' : 'application/octet-stream' },
    url: params.url + `/put-raw?keys=${keys.join(',')}&lens=${lens.join(',')}`,
    data: buf
  })

  self.getRaw = keys => axios({
    method: 'get',
    url: params.url + `/get-raw?keys=${keys.join(',')}`
  })
}

module.exports = RestClient
