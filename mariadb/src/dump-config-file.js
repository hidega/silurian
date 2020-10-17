'use strict'

var { fs } = require('./commons')
var mariadbfw = require('@permian/mariadbfw')

module.exports = cmdAdapter => fs.outputFile(cmdAdapter.getConfiguration().configFilePath, mariadbfw.createConfig(cmdAdapter.getConfiguration()))
