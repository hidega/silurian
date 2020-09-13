'use strict'

const assert = require('assert')
const commons = require('@permian/commons')
const graphdb = require('../src')

const checkError = err => err && (console.log(JSON.stringify(err, null, 2)) || assert.fail())

const echo = str => console.log('- ', str)

const assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

const caseWarmup = () => { }

caseWarmup()

