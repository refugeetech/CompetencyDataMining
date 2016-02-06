#!/bin/sh

docker build -t reftec-import .
docker tag -f reftec-import tutum.co/iteamdev/reftec-import
docker push tutum.co/iteamdev/reftec-import
