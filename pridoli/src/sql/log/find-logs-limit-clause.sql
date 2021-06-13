drop function if exists pridoli_find_logs_limit_clause;

delimiter $$

create function pridoli_find_logs_limit_clause(query_json longtext) returns varchar(255) 
  no sql deterministic
  begin
    declare limit_clause varchar(255) default '';
    declare max_results int default cast(json_unquote(json_extract(query_json, '$.maxResults')) as int);
  
    if max_results is not null then
      set limit_clause = concat(' limit ', max_results);
    end if;
  
    return limit_clause;
  end$$  

delimiter ;
