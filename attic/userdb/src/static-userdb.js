'use strict'

function StaticUserDatabase(userDatabase) { 
  this.findLike = userNameMatcher => {
    var matcher = new RegExp(userNameMatcher || /.*/)
    return userDatabase.reduce((acc, entry) => matcher.test(entry.name) ? acc.concat(entry) : acc,  [])
  }
 
  this.find = userNames => {
    userNames || (userNames = [])
    Array.isArray(userNames) || (userNames = [userNames.toString()])
    return userDatabase.reduce((acc, entry) => userNames.includes(entry.name) ? acc.concat(entry) : acc,  [])
  }
    
  this.findGroup = groupName => userDatabase.reduce((acc, entry) => entry.groups.includes(groupName) ? acc.concat(entry) : acc,  [])
}

module.exports = StaticUserDatabase
