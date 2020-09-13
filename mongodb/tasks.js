'use strict'

const BuildTasks = require('@permian/build-tasks')
const pkg = require('./package')

module.exports = new BuildTasks({ 
  pkg,
  workingDir: process.cwd(),
  transpile: { compact: true, minify: true }
})

