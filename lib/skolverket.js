var http = require('http')
var xml2js = require('xml2js')

var parser = new xml2js.Parser()

var getXml = (path, callback) => {
  var options = {
    hostname: 'pub.ilix.se',
    port: 80,
    path: path,
    method: 'GET',
    headers: {
      'accept-language': 'application/xml'
    }
  }
  var request = http.request(options, res => {
    var xml = ''
    res.on('data', data => {
      xml += data
    })
    res.on('end', () => {
      callback(xml)
    })
  })

  request.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })

  request.end()
}

var getSubjects = (callback) => {
  getXml('/refugee-tech/skolverket/subjectsAndCourses/amnen_och_kurser.xml', xml => {
    parser.parseString(xml, function (err, result) {
      result.SubjectsAndCourses.subject.map(function (s) {
        var subject = {
          "code": s.code[0],
          "name": s.name[0],
          "courses": []
        }

        s.courses.map(function (c) {
          subject.courses.push({
            "code": c.code[0],
            "name": c.name[0]
          })
        })

        callback(subject)
      })
    })
  })
}

module.exports = {
  getXml,
  getSubjects
}
