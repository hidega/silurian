drop procedure if exists pridoli_store_log_entries;

delimiter $$

create procedure pridoli_store_log_entries(entries_json longtext, out check_truncate bool)
  modifies sql data 
  begin
    declare entry json;
    declare owner varchar(1023);
    declare log_data varchar(20000);
    declare tags varchar(511);
    declare data_length int;
      
    set check_truncate = false;
    
    for i in 1..json_length(entries_json) do
      -- set entry = json_extract(entries_json, concat('$[', i - 1, ']'));
      set entry = pridoli_json_array_extract_nth(entries_json, i);
      set owner = json_unquote(json_extract(entry, '$.owner'));
      set log_data = substring(json_unquote(json_extract(entry, '$.logData')), 1, @pridoli_log_max_entry_length);
      set tags = substring(json_extract(entry, '$.tags'), 1, @pridoli_log_tags_max_length);
    
      if tags is not null then
        set tags = pridoli_token_array_to_str_set(pridoli_clean_token_array(tags)); 
      end if;
    
      set data_length = 24 + pridoli_str_length(log_data) + pridoli_str_length(owner) + pridoli_str_length(tags);
    
      insert into pridoli_logs (owner, tags, log_data, data_length) values (owner, tags, log_data, data_length);
    
      if check_truncate = false and last_insert_id() % @pridoli_log_truncate_test_freq = 0 then
        set check_truncate = true;
      end if; 
    end for; 
  end$$ 

delimiter ;
