drop procedure if exists pridoli_truncate_logs;

delimiter $$

create procedure pridoli_truncate_logs(diff_original int) 
  modifies sql data 
  begin
    declare data_length_val int; 
    declare diff int default diff_original; 
    declare last_id_val bigint;
    declare last_id bigint default null;
    declare logs_cursor cursor for select data_length, id from pridoli_logs order by log_timestamp asc; 
  
    open logs_cursor;
  
    read_loop: 
    loop
      if diff < 0 then
        leave read_loop;
      end if;
      fetch logs_cursor into data_length_val, last_id_val; 
      set diff = diff - data_length_val; 
      set last_id = last_id_val;
    end loop;
  
    close logs_cursor; 
   
    if last_id is not null then
      delete from pridoli_logs where id < last_id;
      call pridoli_admin_log(concat('Approx. ', diff_original, ' bytes of ', row_count(), ' log entries were deleted'), @pridoli_log_category_info);
    end if;
  end$$ 

delimiter ;
