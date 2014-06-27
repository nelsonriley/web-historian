// Web Historian
// Serves html to a search page
// Processes requests to lookup archived urls
// Saves archives if they do not yet exist

// dependencies
var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('node-fs');

exports.handleRequest = function (req, res) {

  // Server Logs
  console.log("Serving request type " + req.method + " for url " + req.url);

  // default response code and headers
  var headers = http.headers;
  var statusCode = 200;

  // respond to CORS requests
  if (req.method === "OPTIONS") {
    res.writeHead(statusCode, headers);
    res.end('CORS');
  }

  // helper to serve assets
  // static assets: html, css
  var serveAsset = function(url, type, status) {
    var asset = fs.readFileSync(archive.paths.siteAssets + url, { encoding: 'utf8'} );
    res.writeHead(status, {'Content-Type': type,'Content-Length':asset.length});
    res.end(asset);
  };

  // serve HTML for search page
  var serveSearchPage = function() {
    serveAsset('/index.html', 'text/html', 200);
  };

  // serve CSS for search page
  var serveCSS = function() {
    serveAsset('/styles.css', 'text/css', 200);
  };

  // serve HTML for loading page
  var serveLoadingPage = function() {
    serveAsset('/loading.html', 'text/html', 200);
  };

  // serve an archived page with GET request at  /site.com
  // dynamic assets
  var serveArchivedSite = function() {
    var html = fs.readFileSync(archive.paths.archivedSites + req.url, { encoding: 'utf8'} );
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
    res.end(html);
  };

  // POST form
  // saves the input url to a list
  // serves a loading page if it is in list, but not in archive
  // redirects to the archived html page if the input url is in the list and the archive
  var processSearchURL = function() {
    // listen for form data
    req.addListener("data", function(buffer) {
      var url = buffer.toString('utf8').split("=")[1]; // modifies: url=test.com
      console.log("url is ", url);
      // confirm url is valid and in list
      if (archive.isUrlValid(url) && archive.isUrlInList(url)) {
        // redirect to archived page via headers
        if (archive.isUrlArchived('/'+url)) {
          headers['Location'] = '/'+url;
          res.writeHead(302, headers);
          res.end();
          delete headers['Location'];
        } else {
          serveLoadingPage();
        }
      // write a valid url not in the list and go to loading page
      } else if (archive.isUrlValid(url)) {
        archive.addUrlToList(url);
        serveLoadingPage();
      // if url is not valid re-serve the search page with a blank input field
      } else {
        console.log("did not validate url!");
        serveSearchPage();
      }
    });
  };

  // secondary routing based on request type
  // client base url provides search UI and processes archived url requests
  var handleClient = function() {
    if (req.method === "GET") {
      serveSearchPage();
    }
    if (req.method === "POST") {
      processSearchURL();
    }
  };

  // setup a router for request urls
  var router = {
    '/': handleClient,
    '/styles.css': serveCSS,
    '/historical': processSearchURL
  };

  // primary routing based on url
  if (router[req.url]) {
    router[req.url]();
  } else if (archive.isUrlArchived(req.url)) {
    serveArchivedSite();
  } else {
    res.writeHead(404, headers);
    res.end('Page Not Found 404');
  }

};
