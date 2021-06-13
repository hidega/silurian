drop event if exists pridoli_maintenance;

create event pridoli_maintenance on schedule every @pridoli_maintenance_freq_hours hour do call pridoli_do_maintenance();
