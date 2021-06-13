drop function if exists pridoli_json_array_extract_nth;

delimiter $$

create function pridoli_json_array_extract_nth(json_array json, n int) returns json
  no sql deterministic
  begin
    return json_extract(json_array, concat('$[', n - 1, ']'));
  end$$ 

delimiter ;
