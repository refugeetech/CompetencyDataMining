var elastic = require('./lib/elastic')
var afClient = require('./lib/afClient')
var skolverket = require('./lib/skolverket')

elastic.connect()
console.log('(ElasticSearch) Trying to connect...')

var saveYrkeTree = (treeId, treeName) => {
  elastic.save({
    'id': treeId,
    'foralder': 0,
    'namn': treeName
  }, 'proficiencies', 'proficiency')
  afClient.doRequest('/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=' + treeId, tree => {
    tree.soklista.sokdata.map(data => {
      data.foralder = treeId

      elastic.save(data, 'proficiencies', 'proficiency')
      afClient.doRequest('/af/v0/platsannonser/soklista/yrken?yrkesgruppid=' + data.id, yrken => {
        yrken.soklista.sokdata.map(yrke => {
          yrke.foralder = data.id
          elastic.save(yrke, 'proficiencies', 'proficiency')
        })
      })
    })
  })
}

elastic.on('connect', () => {
  console.log('ES connected')

  /*
   * SubjectsAndCourses (Skolverket).
   */
  skolverket.getSubjects(subject => {
    elastic.save(subject, 'subjects', 'subject')
  })

  /*
   * Languages.
   */
  var languages = require('./data/languages.json')
  Object.keys(languages).map(k => {
    var language = {
      'key': k,
      'name': languages[k].name,
      'nativeName': languages[k].nativeName
    }
    elastic.save(language, 'languages', 'language')
  })

   /*
    * Administration, Ekonomi och Juridik.
    */
  saveYrkeTree(1, 'Administration, Ekonomi och Juridik')

   /*
    * Hälso- och sjukvård.
    */
  saveYrkeTree(8, 'Hälso-/sjukvård')
})
