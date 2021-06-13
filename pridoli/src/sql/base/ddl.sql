drop table if exists pridoli_debug;

create table pridoli_debug ( 
  debug_msg varchar(20000),
  log_timestamp datetime default current_timestamp not null,
  id int unsigned not null auto_increment,
  primary key (id)
) engine=innodb default charset=utf8;
