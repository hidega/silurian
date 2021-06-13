drop procedure if exists pridoli_admin_log;

delimiter $$

create procedure pridoli_admin_log(msg varchar(512), category varchar(63))  
  modifies sql data 
  begin 
    insert into pridoli_logs (owner, log_data, tags) values (@pridoli_sysadmin_id, msg, category);
  end$$ 

delimiter ;
