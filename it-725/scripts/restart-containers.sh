#!/bin/bash

echo "* IT-725 "
echo "* Starting containers"

CMD=podman
NETWORK_NAME=dmz
DMZ_DOMAIN=dmznet
HOST=95.140.42.5

C_EULER=euler
C_GAUSS=gauss
C_LAGRANGE=lagrange
C_CAUCHY=cauchy
C_DEDEKIND=dedekind

IP_BASE=192.168.10
IP_LAGRANGE=$IP_BASE.10
IP_EULER=$IP_BASE.12
IP_GAUSS=$IP_BASE.14
IP_CAUCHY=$IP_BASE.16

shutdown() {
  $CMD network rm $NETWORK_NAME
  $CMD network prune
  $CMD container stop $C_EULER
  $CMD container stop $C_GAUSS
  $CMD container stop $C_LAGRANGE
  $CMD container stop $C_CAUCHY
  $CMD container stop $C_DEDEKIND
  $CMD container rm $C_EULER
  $CMD container rm $C_GAUSS
  $CMD container rm $C_LAGRANGE
  $CMD container rm $C_CAUCHY
  $CMD container rm $C_DEDEKIND
  $CMD container prune
}

setup_network() {
  $CMD network create \
    --subnet=$IP_BASE.0/24 \
    --gateway=$IP_BASE.254 \
    $NETWORK_NAME
}

start_lagrange() {
  $CMD container create \
    --net $NETWORK_NAME \
    --cpus 0.3 \
    --memory 300m \
    --ip $IP_LAGRANGE \
    --health-interval 30s \
    --health-cmd "/opt/it725-proxy/healthcheck.sh && /opt/it725-wss/healthcheck.sh" \
    --health-retries 1 \
    --name $C_LAGRANGE \
    --publish $HOST:8443 18443 \
    --hostname $C_LAGRANGE.$DMZ_DOMAIN \
    it725-$C_LAGRANGE:1 && \
  $CMD container start $C_LAGRANGE
}

start_euler() {
  $CMD container create \
    --net $NETWORK_NAME \
    --cpus 0.3 \
    --memory 300m \
    --ip $IP_EULER \
    --health-interval 60s \
    --health-cmd "/opt/it725-syslog/healthcheck.sh" \
    --health-retries 1 \
    --name $C_EULER \
    --hostname $C_EULER.$DMZ_DOMAIN \
    it725-$C_EULER:1 && \
  $CMD container start $C_EULER
}

start_gauss() {
  $CMD container create \
    --net $NETWORK_NAME \
    --ip $IP_GAUSS \
    --cpus 0.5 \
    --memory 500m \
    --health-interval 60s \
    --health-cmd "/opt/mongodb/healthcheck.sh" \
    --health-retries 1 \
    --name $C_GAUSS \
    --hostname $C_GAUSS.$DMZ_DOMAIN \
    it725-$C_GAUSS:1 && \
  $CMD container start $C_GAUSS
}

start_cauchy() {
  $CMD container create \
    --net $NETWORK_NAME \
    --cpus 0.5 \
    --memory 500m \
    --ip $IP_CAUCHY \
    --health-interval 60s \
    --health-cmd "/opt/it725-counters/healthcheck.sh && /opt/it725-filesrv/healthcheck.sh" \
    --health-retries 1 \
    --name $C_CAUCHY \
    --hostname $C_CAUCHY.$DMZ_DOMAIN \
    it725-$C_CAUCHY:1 && \
  $CMD container start $C_CAUCHY
}

start_dedekind() {
  $CMD container create \
    --net $NETWORK_NAME \
    --cpus 0.3 \
    --memory 300m \
    --ip $IP_DEDEKIND \
    --name $C_DEDEKIND \
    --hostname $C_DEDEKIND.$DMZ_DOMAIN \
    it725-$C_DEDEKIND:1 && \
  $CMD container start $C_DEDEKIND
}

shutdown

setup_network && \
start_lagrange && \
start_euler && \
start_gauss && \
start_cauchy && \
start_dedekind

echo "* result: " $?
