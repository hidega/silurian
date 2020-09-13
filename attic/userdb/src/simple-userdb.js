'use strict'

const {lang} = require('@permian/commons')
const Kvps = require('@silurian/kvps')

function SimpleUserDatabase(kvps) {
  const self = this

  const checkGroupNames = (groupNames, callback) => {
    const result = groupNames.find(groupName => !SimpleUserDatabase.NAME_PATTERN.test(groupName)) 
    result && callback(`Invalid group name: ${result}`)
    return !result
  }

  const checkUserNames = (userNames, callback) => {
    const result = userNames.find(userName => !SimpleUserDatabase.USER_NAME_PATTERN.test(userName)) 
    result && callback(`Invalid user name: ${result}`)
    return !result
  }

  const checkUserLikeNames = (userNames, callback) => {
    const result = userNames.find(userName => !SimpleUserDatabase.USER_LIKE_PATTERN.test(userName)) 
    result && callback(`Invalid user like name: ${result}`)
    return !result
  }

  const upsertUsers = (users, callback) => checkUserNames(users.map(user => user[SimpleUserDatabase.USER_NAME_KEY]), callback) && kvps.putMany(users.map(user => ({ 
    [user[SimpleUserDatabase.USER_NAME_KEY]]: { 
      [SimpleUserDatabase.USER_DATA_KEY]: user[SimpleUserDatabase.USER_DATA_KEY] || {},
      [SimpleUserDatabase.UPSERT_DATE_KEY]: Date.now()
    } 
  })), callback)

  const deleteUsers = (userNames, callback) => checkUserNames(userNames, callback) && kvps.removeMany(userNames, callback)

  const deleteUsersLike = (userNames, callback) => checkUserLikeNames(userNames, callback) && kvps.removeLike(userNames, callback)   

  const deleteGroupsLike = (groupNames, callback) => checkGroupNames(groupNames, callback) && kvps.removeLike(groupNames, callback)

  const deleteGroups = (groupNames, callback) => deleteGroupsLike(groupNames.map(name => name + SimpleUserDatabase.Constants.GROUP_USER_SEPARATOR), callback)

  self.deleteGroupsLike = lang.promisifyIfNoCallback1(deleteGroupsLike)

  self.deleteGroups = lang.promisifyIfNoCallback1(deleteGroups)

  self.upsertUsers = lang.promisifyIfNoCallback1(upsertUsers)

  self.deleteUsers = lang.promisifyIfNoCallback1(deleteUsers)

  self.deleteUsersLike = lang.promisifyIfNoCallback1(deleteUsersLike)

  self.find = (userNames, onData, onEnd) => checkUserNames(userNames, onEnd) && kvps.keysLike(userNames.map(name => name + SimpleUserDatabase.Constants.GROUP_USER_SEPARATOR), onData, onEnd)

  self.findLike = (userNames, onData, onEnd) => checkUserNames(userNames, onEnd) && kvps.keysLike(userNames, onData, onEnd)

  self.diagnostics = kvps.diagnostics

  self.restoreDatabase = kvps.restoreDatabase

  self.dumpDatabase = kvps.dumpDatabase
}

SimpleUserDatabase.createInstance = (config, callback) => {
  const configuration = Object.assign({
    collectionName: 'users',
    databaseName: 'userDatabase',
    id: 'Silurian simple user database'
  }, config)
  Kvps.createInstance({
    kvpsId: configuration.id,
    collectionName: configuration.collectionName,
    databaseName: configuration.databaseName,
    mongodb: configuration.mongodb
  }, (err, kvps) => callback(err, err || new SimpleUserDatabase(kvps))) 
}

SimpleUserDatabase.Constants = Object.freeze({
  NAME_PATTERN: /^[A-Za-z][A-Za-z0-9_]{7,64}$/,
  USER_NAME_PATTERN:/^[A-Za-z][A-Za-z0-9_]{7,64}\$[A-Za-z][A-Za-z0-9_]{7,64}$/,
  USER_LIKE_PATTERN:/^[A-Za-z][A-Za-z0-9_]{7,64}\$[A-Za-z]?[A-Za-z0-9_]*$/,
  GROUP_USER_SEPARATOR: '$',
  USER_NAME_KEY: 'name',
  USER_DATA_KEY: 'data',
  UPSERT_DATE_KEY: 'upsertDate',
  MAX_RESULT_ARRAY_LENGTH: 16*1000
})

module.exports = Object.freeze(SimpleUserDatabase)
