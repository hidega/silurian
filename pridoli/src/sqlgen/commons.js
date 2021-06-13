var path = require('path')
var fsPromises = require('fs/promises')

var DDL_SQL = 'ddl.sql'
var DEFAULTS_SQL = 'defaults.sql'
var SQL_EXT = '.sql'

var filterFiles = files => files.filter(f => f.endsWith(SQL_EXT) && f !== DDL_SQL && f !== DEFAULTS_SQL)

var fileReadPromise = file => fsPromises.readFile(file).then(b => b.toString()).catch(() => '')

var readSqlFiles = dir => fsPromises.readdir(path.resolve(__dirname, '..', '..', 'sql', dir))
  .then(files => [DEFAULTS_SQL, DDL_SQL].concat(filterFiles(files)).map(f => dir + path.sep + f))
  .then(files => Promise.all(files.map(fileReadPromise)))
  .then(data => data.join('\n')) 

var localVarSetStmt = (key, val) => `set @${key} = ${val};\n`

var isString = o => typeof str === 'string'

var isIntegerBetween = (n, min, max) => Number.isNumber(n) && n<= max && n >= min

module.exports = Object.freeze({ 
  readSqlFiles, 
  isString,
  isIntegerBetween,
  localVarSetStmt 
})
