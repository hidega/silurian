var commons = require('../commons')

var parseDefaults = d => {
  var defaults = '\n'

  var truncateTestFrequency = d?.truncateTestFrequency && commons.isIntegerBetween(d.truncateTestFrequency, 10, 10000) ? d.truncateTestFrequency : 500
  defaults += commons.localVarSetStmt('pridoli_log_truncate_test_freq', truncateTestFrequency)

  var highWatermarkBytes = d?.highWatermarkBytes && commons.isIntegerBetween(d.highWatermarkBytes, 1000, 80 * 1000 * 1000 * 1000) ? d.highWatermarkBytes : 20 * 1000 * 1000 * 1000
  defaults += commons.localVarSetStmt('pridoli_log_data_high_watermark_bytes', highWatermarkBytes)

  return defaults + '\n'
}

module.exports = d => commons.readSqlFiles('log').then(s => parseDefaults(d) + s) 
