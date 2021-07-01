drop table if exists pridoli_logs;

create table pridoli_workflows (
  id bigint unsigned not null auto_increment,
  start_timestamp datetime,
  end_timestamp datetime,
  wf_status varchar(63) default 'PRE_START' not null,
  wf_label varchar(255),
  wf_name varchar(255),
  wf_data json,
  constraint pridoli_cst_wf_status check(wf_status in ('PRE_START', 'RUNNING', 'END', 'FAILED')),
  primary key (id)
) engine=innodb default charset=utf8;

