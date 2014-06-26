var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('node-fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  // helpful logging
  console.log("Serving request type " + req.method + " for url " + req.url);
  // default response code and headers
  var headers = http.headers;
  var statusCode = 200;

  // handle CORS
  if (req.method === "OPTIONS") {
    res.writeHead(statusCode, headers);
    res.end('CORS');
  }

  // serve HTML for search page
  var serveSearchPage = function() {
    var html = fs.readFileSync(archive.paths.siteAssets + '/index.html', { encoding: 'utf8'} );
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
    res.end(html);
  };

  // serve CSS for search page
  var serveCSS = function() {
    var css = fs.readFileSync(archive.paths.siteAssets + '/styles.css', { encoding: 'utf8'} );
    res.writeHead(200, {'Content-Type': 'text/css','Content-Length':css.length});
    res.end(css);
  };

  // POST from form should return data    data.url = "someURL"
  var processSearchURL = function() {
    console.log("processing");
    req.addListener("data", function(buffer) {
      // ie url=test.com
      console.log(buffer.toString('utf8'));
    });
    // temporary, maybe
    serveSearchPage();
  };

  // setup a router for request urls
  var router = {
    '/': serveSearchPage,
    '/styles.css': serveCSS,
    '/historical': processSearchURL
  };

  if (router[req.url]) {
    router[req.url]();
  } else {
    res.writeHead(404, headers);
    res.end('Page Not Found 404');
  }

};
