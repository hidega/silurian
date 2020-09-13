'use strict'
 
const {lang} = require('@permian/commons')
const startRestendpoint = require('./restendpoint')
 
function StaticUserDatabase(dbFile) {
  const self = this
  
  const userDatabase = require(dbFile)
  
  self.findLike = (userNameMatcher, onData, onEnd) => {
    const matcher = new RegExp(userNameMatcher)
    onData(userDatabase.reduce((acc, entry) => matcher.test(entry.name) ? acc.concat(entry) : acc,  []))
    onEnd && onEnd()
  }
 
  self.find = (userNames, onData, onEnd) => {
    lang.isString(userNames) && (userNames = [userNames])
    onData(userDatabase.reduce((acc, entry) => userNames.includes(entry.name) ? acc.concat(entry) : acc,  []))
    onEnd && onEnd()
  }
    
  self.findGroup = (groupName, onData, onEnd) => {
    onData(userDatabase.reduce((acc, entry) => entry.groups.includes(groupName) ? acc.concat(entry) : acc,  []))
    onEnd && onEnd()
  }
}

StaticUserDatabase.startService = p => startRestendpoint(p.restEndpoint, new StaticUserDatabase(p.dbFile))

module.exports = StaticUserDatabase
