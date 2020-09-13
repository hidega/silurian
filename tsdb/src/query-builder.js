'use strict'

const mongodbfw = require('@permian/mongodbfw')
const {Constants} = require('./connector')

function QueryBuilder() {
  const self = this

  let fromDate = false
  let untilDate = false
  let fromId = false
  let untilId = false
  let flags = false
  let tags = false
  let ids = false
  let criterion = []

  self.addCriteria = c => {
    criterion.push(c)
    return self
  }

  self.setFromDate = f => {
    fromDate = f
    return self
  }

  self.setUntilDate = u => {
    untilDate = u
    return self
  }

  self.setBetween = (f, u) => {
    self.setFromDate(f)
    self.setUntilDate(u)
    return self
  }

  self.setFlags = f => {
    flags = f
    return self
  }

  self.setTags= t => {
    tags = t
    return self
  }

  self.setIds= i => {
    ids = i
    return self
  }

  self.build = () => {
    const filter = []
    fromDate===false || filter.push({ _id: { $gte: mongodbfw.objectIdFromDate(fromDate) } })
    untilDate===false || filter.push({ _id: { $lte: mongodbfw.objectIdFromDate(untilDate) } })
    fromId===false || filter.push({ _id: { $gte: mongodbfw.objectIdOf(fromId) } })
    untilId===false || filter.push({ _id: { $lte: mongodbfw.objectIdOf(untilId) } })
    flags && filter.push({ [Constants.FLAG_KEY]: { $in: flags } })
    tags && filter.push({ [Constants.TAG_KEY]: { $in: tags } })
    ids && filter.push({ _id: { $in: ids } })
    criterion.forEach(filter.push)
    return { $and: filter }
  }
}

QueryBuilder.newInstance = () => new QueryBuilder()

module.exports = QueryBuilder
