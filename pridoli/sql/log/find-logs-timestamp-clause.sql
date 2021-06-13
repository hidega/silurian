drop function if exists pridoli_find_logs_timestamp_clause;

delimiter $$

create function pridoli_find_logs_timestamp_clause(query_json longtext) returns varchar(255) 
  no sql deterministic
  begin
    declare timestamp_from datetime default cast(json_unquote(json_extract(query_json, '$.timestampFrom')) as datetime);
    declare timestamp_to datetime default cast(json_unquote(json_extract(query_json, '$.timestampTo')) as datetime);
    declare timestamp_clause varchar(255) default null;
  
    if timestamp_from is not null and @timestamp_from is not null then
      set timestamp_clause = concat('(log_timestamp between \'', timestamp_from, '\' and \'', timestamp_to, '\')');
    elseif timestamp_from is not null then  
      set timestamp_clause = concat('(log_timestamp > \'', timestamp_from, '\')');
    elseif timestamp_to is not null then  
      set timestamp_clause = concat('(log_timestamp < \'', timestamp_to, '\')');
    end if;
  
    return timestamp_clause;
  end$$
  
delimiter ;
