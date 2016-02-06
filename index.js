var fs = require('fs');
var xml2js = require('xml2js');
var elastic = require('./lib/elastic');

var parser = new xml2js.Parser();

elastic.connect();
console.log('(ElasticSearch) Trying to connect...');
elastic.on('connect', function () {
  console.log('ES connected');

  /*
   * SubjectsAndCourses
   */
  fs.readFile(process.env.COURSES || '/Users/ilix/skolverket/amnen_och_kurser.xml', function (err, data) {
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

            elastic.saveSubject(subject);
          });
      });
  });

  /*
   * Languages
   */
  var languages = require('./data/languages.json');
  Object.keys(languages).map(function (k) {
     var language = {
       "key": k,
       "name": languages[k].name,
       "nativeName": languages[k].nativeName
     };
     console.log('Language: ', language);
     elastic.saveLanguage(language);
   });

  /*
   * Yrkesområden.
   */
  var yrkesomraden = require('./data/yrkesomraden.json');
  yrkesomraden.soklista.sokdata.map(function (yrkesomrade) {
    elastic.saveYrkesomrade(yrkesomrade);
  });

  /*
   * Administration, Ekonomi och Juridik.
   */
  var adminEkonomiJuridik = require('./data/adminEkonomiJuridik.json');
  adminEkonomiJuridik.soklista.sokdata.map(function (yrkesomrade) {
    yrkesomrade.parent = 1;
    elastic.saveYrkesomrade(yrkesomrade);
  });

  /*
   * Administration, Ekonomi och Juridik.
   */
  var halsoSjukvard = require('./data/halsoSjukvard.json');
  halsoSjukvard.soklista.sokdata.map(function (yrkesomrade) {
    yrkesomrade.parent = 8;
    elastic.saveYrkesomrade(yrkesomrade);
  });
});
