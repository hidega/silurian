drop function if exists pridoli_find_logs_result;

delimiter $$

create function pridoli_find_logs_result(log_id bigint, log_timestamp datetime, tags json, owner varchar(1023), log_data longtext) returns varchar(22000)
  no sql deterministic
  begin
    declare tags_str varchar(1023) default '';
    declare log_data_str varchar(20000) default concat('"data":"', replace(log_data, '"', '\"'), '",');
  
    if tags is not null then
      set tags_str = concat('"tags":', tags, ',');
    end if;
  
    return concat('{"id":', log_id, ',"owner":"', owner, '",', tags_str, log_data_str, '"timestamp":"', log_timestamp, '"}'); 
  end$$

delimiter ;
