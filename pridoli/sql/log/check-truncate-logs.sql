drop procedure if exists pridoli_check_truncate_logs;

delimiter $$

create procedure pridoli_check_truncate_logs() 
  modifies sql data 
  begin
    declare diff int;
    declare log_data_size int;
    
    select sum(data_length) from pridoli_logs into log_data_size; 
  
    set diff = log_data_size - @pridoli_log_data_high_watermark_bytes; 
  
    if diff > 0 then 
      call pridoli_truncate_logs(diff);
    end if;
  end$$ 

delimiter ;
