var commons = require('./commons')
var base = require('./base')
var log = require('./log')

var startStmts = defaults => `
set autocommit = 0;

start transaction;

drop database if exists ${defaults.base.pridoliDatabaseName};

create database ${defaults.base.pridoliDatabaseName};

use ${defaults.base.pridoliDatabaseName};

`

var closingStmts = defaults => `
call pridoli_reset_user('${defaults.base.pridoliUserName}', '${defaults.base.pridoliUserPassword}', '${defaults.base.pridoliDatabaseName}');

commit;

call pridoli_admin_log('Initialization completed successfully', @pridoli_log_category_info);

-- generated on ${new Date().toISOString()}
` 

var parseDefaults = defaults => {
  defaults ??= {}
  defaults.base ??= {}
  defaults.log ??= {}
  defaults.kvps ??= {}
  defaults.lock ??= {}
  defaults.maintenance ??= {}
  defaults.messagebus ??= {}
  defaults.users ??= {}

  var b = defaults.base

  var pridoliDatabaseName = b?.pridoliDatabaseName && commons.isString(b.pridoliDatabaseName) && /[a-z]{8,16}*/.test(b.pridoliDatabaseName) ? b.pridoliDatabaseName : 'pridolidb'
  var pridoliUserPassword = b?.pridoliUserPassword && commons.isString(d.pridoliUserPassword) && /[0-9a-zA-Z]{8,16}/.test(b.pridoliUserPassword) ? b.pridoliUserPassword : 'Abcdefg12345'
  var pridoliUserName = b?.pridoliUserName && commons.isString(b.pridoliUserName) && /[a-z]{8,16}[0-9]*/.test(b.pridoliUserName) ? b.pridoliUserName : 'pridoliuser'

  defaults.base = {
    pridoliUserPassword,
    pridoliUserName,
    pridoliDatabaseName
  }

  return defaults
}

module.exports = (d, defaults = parseDefaults(d)) => Promise.all([base(defaults.base), log(defaults.log)])
  .then(scripts => startStmts(defaults) + scripts.join('\n') + closingStmts(defaults))  
  