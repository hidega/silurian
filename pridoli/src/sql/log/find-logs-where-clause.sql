drop function if exists pridoli_find_logs_where_clause;

delimiter $$

create function pridoli_find_logs_where_clause(query_json longtext) returns varchar(4095)
  no sql deterministic
  begin
    declare timestamp_clause varchar(255);
    declare owner_clause varchar(511);
    declare tags_clause varchar(511);
    declare where_clause varchar(4095) default '';
  
    if query_json is null then
      set query_json = '{}';
    end if;
  
    set timestamp_clause = pridoli_find_logs_timestamp_clause(query_json);
    set owner_clause = pridoli_find_logs_owner_clause(query_json); 
    set tags_clause = pridoli_find_logs_tags_clause(query_json); 
  
    if not (timestamp_clause is null and owner_clause is null and tags_clause is null) then
      set where_clause = concat('where ', concat_ws(' and ', timestamp_clause, owner_clause, tags_clause));
    end if;
  
    return where_clause;
  end$$

delimiter ;
