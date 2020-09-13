'use strict'

const BuildTasks = require('@permian/build-tasks')
const pkg = require('./package.json')

module.exports = new BuildTasks({ pkg, transpile: { compact: true, minify: true }})
