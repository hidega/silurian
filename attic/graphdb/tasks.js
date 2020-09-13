'use strict'

const BuildTasks = require('@permian/build-tasks')
const pkg = require('./package.json')

module.exports = new BuildTasks({ 
  pkg: pkg,
  workingDir: process.cwd(),
  transpile: { compact: true, minify: true }
})

