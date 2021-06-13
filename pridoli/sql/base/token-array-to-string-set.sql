drop function if exists pridoli_token_array_to_str_set;

delimiter $$

create function pridoli_token_array_to_str_set(tokens json) returns varchar(22000)
  no sql deterministic
  begin
    declare str_set varchar(22000) default '';
    declare len int default json_length(tokens); 
    declare elem json;
  
    for i in 1..len do 
      -- set elem = json_extract(tokens, concat('$[', i - 1, ']'));
      set elem = pridoli_json_array_extract_nth(tokens, i);
      set str_set = concat(str_set, json_unquote(elem));
      if i <> len then
        set str_set = concat(str_set, ',');
      end if;
    end for; 
    return str_set;
  end$$ 

delimiter ;
