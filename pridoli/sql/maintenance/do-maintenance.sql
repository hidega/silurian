drop procedure if exists pridoli_do_maintenance;

delimiter $$

create procedure pridoli_do_maintenance()  
  modifies sql data 
  begin 
    declare exit handler for sqlexception
      begin
        rollback;
        select pridoli_admin_log('Maintenance error.', @pridoli_log_category_error);
      end; 
    
    start transaction;
    call pridoli_check_truncate_logs();
    commit;
  
    call pridoli_admin_log('Hourly maintenance is done.', @pridoli_log_category_info);
  end$$

delimiter ;
