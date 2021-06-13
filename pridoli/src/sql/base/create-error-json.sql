drop function if exists pridoli_create_error_json;

delimiter $$

create function pridoli_create_error_json(error_msg varchar(1023)) returns varchar(1023)
  no sql deterministic
  begin 
    return concat('{ "error": "', replace(substring(error_msg, 1, 950), '"', '\\"'), '"}');
  end$$ 

delimiter ;
