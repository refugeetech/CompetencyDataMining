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
      if (process.env.SUBPROFS || 'false' === 'true') {
        elastic.save(data, 'proficiencies', 'proficiency').then(saved => {
          afClient.doRequest('/af/v0/platsannonser/soklista/yrken?yrkesgruppid=' + data.id, yrken => {
            yrken.soklista.sokdata.map(yrke => {
              yrke.foralder = data.id
              elastic.save(yrke, 'proficiencies', 'proficiency')
            })
          })
        })
      }
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
    * Profs.
    */
  saveYrkeTree(1, 'Administration, Ekonomi och Juridik')
  saveYrkeTree(2, 'Bygg och anläggning')
  saveYrkeTree(20, 'Chefer och verksamhetsledare')
  saveYrkeTree(3, 'Data/IT')
  saveYrkeTree(5, 'Försäljning, inköp, marknadsföring')
  saveYrkeTree(6, 'Hantverksyrken')
  saveYrkeTree(7, 'Hotell, restaurang, storhushåll')
  saveYrkeTree(8, 'Hälso-/sjukvård')
  saveYrkeTree(9, 'Industriell tillverkning')
  saveYrkeTree(10, 'Installation, drift, underhåll')
  saveYrkeTree(4, 'Kropps- och skönhetsvård')
  saveYrkeTree(11, 'Kultur, media, design')
  saveYrkeTree(13, 'Naturbruk')
  saveYrkeTree(14, 'Naturvetenskapligt arbete')
  saveYrkeTree(15, 'Pedagogiskt arbete')
  saveYrkeTree(12, 'Sanering och renhållning')
  saveYrkeTree(16, 'Socialt arbete')
  saveYrkeTree(17, 'Säkerhetsarbete')
  saveYrkeTree(18, 'Tekniskt arbete')
  saveYrkeTree(19, 'Transport')

})
