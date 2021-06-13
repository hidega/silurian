var path = require('path')
var fsPromises = require('fs/promises')
var readSql = require('../src/sql')

readSql().then(sql => fsPromises.writeFile(path.resolve(__dirname, 'pridoli.sql'), sql))

