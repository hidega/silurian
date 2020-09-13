#!/bin/bash

su mysql -c "./bin/mysqld --defaults-file=/opt/app/prg/mysql/my.cnf $1 $2 $3 $4 $5 $6 &"
