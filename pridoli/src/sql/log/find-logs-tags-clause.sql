drop function if exists pridoli_find_logs_tags_clause;

delimiter $$

create function pridoli_find_logs_tags_clause(query_json longtext) returns varchar(511) 
  no sql deterministic
  begin
    declare tags_clause varchar(511) default null; 
    declare has_all_tags varchar(511) default json_extract(query_json, '$.hasAllTags'); 
    declare has_any_tag varchar(511) default json_extract(query_json, '$.hasAnyTag'); 
  
    if has_all_tags is not null and length(has_all_tags) < 400 then 
      set tags_clause = null;
    elseif has_any_tag is not null and length(has_any_tag) < 400 then 
      set tags_clause = null;
    end if;
  
    return tags_clause;
  end$$

delimiter ;
