drop procedure if exists pridoli_reset_user;

delimiter $$

create procedure pridoli_reset_user(user_name varchar(31), password varchar(31), db_name varchar(31))
  modifies sql data 
  begin 
    declare host_name varchar(31) default 'localhost';
    declare found_user varchar(31) default null;
    declare error_msg varchar(255) default concat_ws(', ', 'Invalid username / password / database name :', user_name, password, db_name);
    declare full_user_name varchar(63);
  
    if user_name is null or user_name not rlike '[a-z]{8,16}[0-9]*' or password is null or password not rlike '[0-9a-zA-Z]{8,16}' or db_name is null or db_name not rlike '[a-z]{8,16}' then
      signal sqlstate '45000' set message_text = error_msg;
    end if;
  
    set full_user_name = concat('\'', user_name, '\'@\'', host_name, '\'');
    
    select user from mysql.user where host like host_name and user like user_name into found_user; 
  
    if found_user is not null then
      call pridoli_execute_statement(concat('revoke all privileges, grant option from ', full_user_name)); 
      call pridoli_execute_statement(concat('drop user ', full_user_name));
    end if;
  
    call pridoli_execute_statement(concat('create user ', full_user_name, ' identified by \'', password, '\''));
    call pridoli_execute_statement(concat('grant all privileges on ', db_name, '.* to ', full_user_name));
    flush privileges; 
  end $$

delimiter ;
