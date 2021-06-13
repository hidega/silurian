drop procedure if exists pridoli_log_entries;

delimiter $$

create procedure pridoli_log_entries(entries_json longtext, out result_msg varchar(1023))
  modifies sql data 
  begin 
    declare check_truncate bool;
  
    declare exit handler for sqlexception
      begin
        rollback;
        set result_msg = pridoli_create_error_json(pridoli_get_errors());
      end;
    
    start transaction; 

    call pridoli_store_log_entries(entries_json, check_truncate); 
  
    if check_truncate then
      call pridoli_check_truncate_logs();
    end if;  
  
    commit;
  
    set result_msg = @pridoli_result_success;
  end$$

delimiter ;
