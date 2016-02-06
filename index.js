var fs = require('fs');
var xml2js = require('xml2js');
var elastic = require('./lib/elastic');
var afClient = require('./lib/afClient');

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
     elastic.saveLanguage(language);
   });

   /*
    * Administration, Ekonomi och Juridik.
    */
   elastic.save({
     'id': 1,
     'foralder': 0,
     'namn': 'Administration, Ekonomi och Juridik'
   }, 'yrken', 'yrke');
   afClient.doRequest('/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=' + 1, function (tree) {
     tree.soklista.sokdata.map(function (data) {
       data.foralder = 1;
       elastic.save(data, 'yrken', 'yrke');
       afClient.doRequest('/af/v0/platsannonser/soklista/yrken?yrkesgruppid=' + data.id, function (yrke) {
         yrke.foralder = data.id;
         elastic.save(yrke, 'yrken', 'yrke');
       });
     });
   });
});
