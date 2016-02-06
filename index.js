var fs = require('fs');
var xml2js = require('xml2js');
var elastic = require('./lib/elastic');

var parser = new xml2js.Parser();

elastic.connect();
console.log('(ElasticSearch) Trying to connect...');
elastic.on('connect', function() {
  console.log('ES connected');
  fs.readFile(process.env.COURSES || '/Users/ilix/skolverket/amnen_och_kurser.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
          result.SubjectsAndCourses.subject.map(function (s) {
            var subject = {
              "code": s.code[0],
              "name": s.name[0],
              "courses": []
            };

            s.courses.map(function (c) {
              subject.courses.push({
                "code": c.code[0],
                "name": c.name[0]
              });
            });

            //console.log('Subject: ', subject);
            elastic.saveSubject(subject);
          });
      });
  });
});
