drop function if exists pridoli_clean_token_array;

delimiter $$

create function pridoli_clean_token_array(tokens json) returns json
  no sql deterministic
  begin
    declare retval json default '[]';
    declare elem varchar(20000); 
  
    if tokens is not null and json_type(tokens) like 'ARRAY' then
      set tokens = replace(tokens, ' ', '');
      set retval = json_array();
      for i in 1..json_length(tokens) do 
        -- set elem = cast(json_unquote(json_extract(tokens, concat('$[', i - 1, ']'))) as char);
        set elem = cast(json_unquote(pridoli_json_array_extract_nth(tokens, i)) as char);
        if pridoli_check_token(elem) = true then
          set retval = json_array_insert(retval, '$[0]', elem);
        end if;
      end for;
    end if;
  
    return retval;
  end$$ 

delimiter ;
