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

  // connectClient at base URL
  var handleClient = function() {
    if (req.method === "GET") {
      serveSearchPage();
    }
    if (req.method === "POST") {
      processSearchURL();
    }
  };

  // serve an archived page with GET request at  /site.com
  var serveArchivedSite = function() {
    var html = fs.readFileSync(archive.paths.archivedSites + req.url, { encoding: 'utf8'} );
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
    res.end(html);
  };

  // serve HTML for search page
  var serveSearchPage = function() {
    var html = fs.readFileSync(archive.paths.siteAssets + '/index.html', { encoding: 'utf8'} );
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
    res.end(html);
  };

  // serve HTML for loading page
  var serveLoadingPage = function() {
    var html = fs.readFileSync(archive.paths.siteAssets + '/loading.html', { encoding: 'utf8'} );
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
    // listen for form data
    req.addListener("data", function(buffer) {
      // example stringified response: url=test.com
      var url = buffer.toString('utf8').split("=")[1];
      // should check if url is valid!
      if (archive.isUrlInList(url)) {
        // check if the file is in the archive
        if ( archive.isUrlArchived('/'+url) ) {
          headers['Location'] = '/'+url;
          res.writeHead(302, headers);
          res.end();
          delete headers['Location'];
        } else {
          serveLoadingPage();
        }
      } else {
      // if not in list, add to list and go to loading page
        archive.addUrlToList(url);
        serveLoadingPage();
      }

    });
  };

  // setup a router for request urls
  var router = {
    '/': handleClient,
    '/styles.css': serveCSS,
    '/historical': processSearchURL
  };

  if (router[req.url]) {
    router[req.url]();
  } else if (archive.isUrlArchived(req.url)) {
    serveArchivedSite();
  } else {
    res.writeHead(404, headers);
    res.end('Page Not Found 404');
  }

};
