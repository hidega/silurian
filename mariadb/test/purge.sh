#!/bin/bash

# run as root

TEST_DIR=/tmp/mariadb-test

rm -rf $TEST_DIR
mkdir $TEST_DIR && \
cp -r ../* $TEST_DIR && \
chown -cfR mysql $TEST_DIR > /dev/null 2>&1 && \
su -s /bin/bash -c "/opt/prg/nodejs/bin/node $TEST_DIR/test/purge.js" mysql
