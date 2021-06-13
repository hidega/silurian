drop table if exists pridoli_logs;

create table pridoli_logs (
  id bigint unsigned not null auto_increment,
  log_timestamp datetime default current_timestamp not null,
  tags varchar(2047),
  owner varchar(1023) not null,
  log_data longtext not null,
  data_length int default 100 not null,
  constraint pridoli_cst_owner_name check(owner rlike '^[a-zA-Z][a-zA-Z0-9_\.]*$'),
  constraint pridoli_cst_tags check(tags is null or tags rlike '^[a-zA-Z][\"\,a-zA-Z0-9_ ]*$'),  
  primary key (id)
) engine=innodb default charset=utf8;

-- create index idx_logs_timestamp on pridoli_logs (log_timestamp);  -- DOTO

insert into pridoli_logs (owner, log_data, tags) values (@pridoli_sysadmin_id, 'Initialization has started', @pridoli_log_category_info);
