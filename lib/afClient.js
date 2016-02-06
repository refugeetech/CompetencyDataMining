var http = require('http');

module.exports = {
  self: this,
  doRequest: function doRequest (path, callback) {
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
    };
    var req = http.request(options, function (res) {
      var str = '';
      res.on('data', function (data) {
        str += data;
      });
      res.on('end', function () {
        callback(JSON.parse(str));
      });
    });

    req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
    });

    req.end();
  }
};
