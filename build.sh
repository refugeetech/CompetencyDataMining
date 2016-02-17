#!/bin/sh

docker build -t competency-data-mining .
docker tag -f competency-data-mining iteamoperations/competency-data-mining
docker push iteamoperations/competency-data-mining
