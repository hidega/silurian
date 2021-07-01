drop table if exists pridoli_customers;

create table pridoli_customers (
  id bigint unsigned not null auto_increment,
  registration_timestamp datetime default current_timestamp not null,
  contact_info json,
  clerical_info json,
  display_name varchar(255) not null,
  customer_status varchar(255) not null,
  constraint pridoli_cst_customer_status check(wf_status in ('ACTIVE', 'INACTIVE', 'UNKNOWN')),
  primary key (id)
) engine=innodb default charset=utf8;

