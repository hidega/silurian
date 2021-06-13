drop function if exists pridoli_debug_msg;

delimiter $$

create procedure pridoli_debug_msg(msg varchar(255))
  begin 
    insert into pridoli_debug (debug_msg) values (msg); 
  end $$

delimiter ;
