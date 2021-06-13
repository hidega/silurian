drop procedure if exists pridoli_find_logs;

delimiter $$

create procedure pridoli_find_logs(query_json longtext)
  reads sql data 
  begin
    declare stmt_str varchar(4095) default 'select pridoli_find_logs_result(id, log_timestamp, tags, owner, log_data) as log_entries_json from pridoli_logs ';
    declare order_clause varchar(63) default ' order by log_timestamp desc ';
  
    declare exit handler for sqlexception
      begin
        rollback;
        select pridoli_create_error_json(pridoli_get_errors());
      end;  
  
    set stmt_str = concat(stmt_str, pridoli_find_logs_where_clause(query_json), order_clause, pridoli_find_logs_limit_clause(query_json));
  
    prepare find_logs_stmt from stmt_str; 
    execute find_logs_stmt;
    deallocate prepare find_logs_stmt;

    select stmt_str;
  end$$

delimiter ;
