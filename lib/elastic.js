'use strict'
var Q = require('q')
var elasticsearch = require('elasticsearch')
var util = require('util')
var events = require('events')

var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH || '192.168.99.100:9200',
  retryCount: 5
})

console.log('(ElasticSearch) Connecting to ',  process.env.ELASTICSEARCH)

var Connector = function () {
  var self = this

  this.saveSubject = function saveSubject (json) {

    var params = {
      index: 'subjects',
      type: 'subject',
      '@timestamp': new Date().toString(),
      body: json
    };

    console.log('Saving subject: ', json.name);

    return Q.promise(function (resolve, reject) {

      client.index(params, function (error) {
        if (error) {
          console.log('(ElasticSearch) Index ERROR!', error)
          reject(error);
          return;
        }

        resolve(json);
      });
    });

  };

  // retry until we reach the server - it takes time to start it so we need to wait
  this.connect = function () {
    console.log('(ElasticSearch) ping')
    client.ping({}, function (err) {
      console.log('(ElasticSearch) pong')
      if (!err) {
        console.log('(ElasticSearch) connect')
        self.setup(function () {
          self.emit('connect');
        });
      } else {
        console.log(err, '(ElasticSearch) reconnect')
        setTimeout(self.connect, 1000)
      }
    })
  }

  this.mapping = function () {
    client.indices.putMapping({
      index: 'subjects',
      type: 'subject',
      body: {
        "subject": {
          "properties": {
            "code": {
              "type": "string"
             },
             "name": {
              "type": "string"
             },
             "courses": {
              "type": "nested",
              "properties": {
                "code": { "type": "string"},
                "name": { "type": "string"}
              }
            }
          }
        }
      }
    })
  };

  this.setup = function (after) {
    console.log('(ElasticSearch) setup.');
    client.index({'index': 'subjects', 'type': 'subject', 'body': {}}, this.mapping);
    setTimeout(function () {
      console.log('(ElasticSearch) setup callback.');
      after();
    }, 2000);
  }

}

util.inherits(Connector, events.EventEmitter)
module.exports = new Connector()
