drop function if exists pridoli_find_logs_owner_clause;

delimiter $$

create function pridoli_find_logs_owner_clause(query_json longtext) returns varchar(511) 
  no sql deterministic
  begin
    declare owner_clause varchar(511) default null;
    declare owners json default json_extract(query_json, '$.owners'); 
  
    if owners is not null and length(owners) < 400 then 
      set owner_clause = concat('(find_in_set(lower(owner), lower(\'', pridoli_token_array_to_str_set(pridoli_clean_token_array(owners)), '\')) <> 0)');
    end if;
  
    return owner_clause;
  end$$

delimiter ;
