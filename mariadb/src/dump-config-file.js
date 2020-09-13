'use strict'

const { fs } = require('./commons')
const mariadbfw = require('@permian/mariadbfw')

module.exports = cmdAdapter => fs.outputFile(cmdAdapter.getConfiguration().configFilePath, mariadbfw.createConfig(cmdAdapter.getConfiguration()))
