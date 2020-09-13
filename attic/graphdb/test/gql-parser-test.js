'use strict'

const assert = require('assert')
const parse = require('../src/parser')

let testCount = 5

const logger = {
  info: (...args) => console.log('INFO', args),
  error: (...args) => console.log('ERROR', args)
}

const error = (code, err) => {
  console.log('\n** ERROR: ', code, err, '\n')
  assert(false)
}

const success = result => {
  console.log('result received', result)
  if(!--testCount) {
    console.log('Tests are OK')
    process.exit(0)
  }
}
/*
//----------- 0 ---------------------------------------------------------------
{
  parse('', {}, err => assert(err))
}
*/
/*
//----------- 1 ---------------------------------------------------------------
{
  const testData = '     '
  parse(testData, { logger }, err => err ? error(1, err) : success())
}
*/
/*
//----------- 2 ---------------------------------------------------------------
{
  const testData = '  234234 "jkljluii"  1.002 $lkjui   dfhj687  '
  parse(testData, { logger }, err => err ? error(2, err) : success())
}
*/
/*
//----------- 3 ---------------------------------------------------------------
{
  const testData = ` 
    76476 "665hgh" k
    
991.002 $tztzz  99
     
     
        jk789kj  `
        
  parse(testData, { logger }, err => err ? error(2, err) : success())
}
*/
/*
//----------- 4 ---------------------------------------------------------------
{
  const testData = `# COMMENT_1 df ttz 6776675 hgf
    76476 "665hgh" k #COMMENT_2
       # COMMENT_3 g g g  
     991.002 $tztzz 
     # 
     #
        jk789kj  #COMMENT_10
`
        
  parse(testData, { logger }, err => err ? error(2, err) : success())
}
*/
//----------- 5 ---------------------------------------------------------------
{
  const testData = ` 
    select nodes 
      where id like "abc*"
  `
        
  parse(testData, { logger }, (err, result) => err ? error(2, err) : success(result))
}

setTimeout(() => error(-1, 'timeout - test counter: ' + testCount), 5000)
