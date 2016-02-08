# CompetencyDataMining

## Introduction

This repo is part of the "Competency.se" project from the Refugee Tech hackathon that was held in Stockholm, feb 6-7 2016. The data mining part is used to experiment with various open data sources available in Sweden (and possibly abroad as well).

In short, the code written here is used to import data into ElasticSearch.

## Interesting links

 - http://www.arbetsformedlingen.se/psidata
 - http://opendata.skolverket.se

## Running

### run with docker

See docker-compose.yml for more info.

```
docker-compose up
```

### run locally

Use env to set IP and port of your elasticsearch.

```
npm install
ELASTICSEARCH=127.0.0.1:9200 node index.js
```
