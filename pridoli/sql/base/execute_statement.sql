drop procedure if exists pridoli_execute_statement;

delimiter $$

create procedure pridoli_execute_statement(stmt_str varchar(1023))
  modifies sql data 
  begin 
    prepare m_stmt from stmt_str; 
    execute m_stmt;
    deallocate prepare m_stmt;
  end $$

delimiter ;
