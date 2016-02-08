'use strict'
var http = require('http')

var doRequest = (path, callback) => {
  var options = {
    hostname: 'api.arbetsformedlingen.se',
    port: 80,
    path: path,
    method: 'GET',
    headers: {
      'Accept': '*',
      'accept-language': 'json',
      'Content-Type': 'application/json'
    }
  }
  var req = http.request(options, res => {
    var str = ''
    res.on('data', data => {
      str += data
    })
    res.on('end', () => {
      callback(JSON.parse(str))
    })
  })

  req.on('error', e => {
    console.log('problem with request: ' + e.message)
  })

  req.end()
}

module.exports = {
  doRequest
}
