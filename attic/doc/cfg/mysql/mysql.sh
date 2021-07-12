#!/bin/bash

su mysql -c "./bin/mysql --defaults-file=/opt/app/prg/mysql/my.cnf $1 $2 $3 $4 $5 $6"
