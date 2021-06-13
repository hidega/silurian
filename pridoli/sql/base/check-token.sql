drop function if exists pridoli_check_token;

delimiter $$

create function pridoli_check_token(token varchar(20000)) returns bool  
  no sql deterministic
  begin
    declare valid bool default false;
  
    if token is not null and token rlike @pridoli_token_regexp and token not rlike '([^.]*\\.\\.)' and token not like '%\\.' then
      set valid = true;
    end if;
  
    return valid;
  end$$  

delimiter ;
