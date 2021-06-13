drop function if exists pridoli_str_length;

delimiter $$

create function pridoli_str_length(str varchar(22000)) returns int
  no sql deterministic
  begin
    return length(ifnull(str, ''));
  end$$ 

delimiter ;
