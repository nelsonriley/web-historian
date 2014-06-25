var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('node-fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  // helpful logging
  console.log("Serving request type " + req.method + " for url " + req.url);
  // default response code and headers
  var headers = defaultCorsHeaders;
  headers["Content-Type"] = "text/plain";
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

  // setup a router for request urls
  var router = {
    '/': serveSearchPage,
    '/styles.css': serveCSS
  };

  if (router[req.url]) {
    router[req.url]();
  } else {
    res.writeHead(404, headers);
    res.end('Page Not Found 404');
  }

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
