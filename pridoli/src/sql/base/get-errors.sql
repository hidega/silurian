drop function if exists pridoli_get_errors;

delimiter $$

create function pridoli_get_errors() returns varchar(1023)
  begin 
    get diagnostics condition 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
    return concat('error ', @errno, ' (', @sqlstate, '): ', @text);
  end$$

delimiter ;
