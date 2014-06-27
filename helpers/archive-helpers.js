var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')  // ie  /Users/student/Code/nelsonriley/2014-06-web-historian/archives/sites.txt
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(fun){
  var text = fs.readFileSync(exports.paths.list, { encoding: 'utf8'} );
  var urls = text.split('\n');
  fun(urls);
};

exports.isUrlValid = function(url){
  if (url.indexOf('.com') > -1 || url.indexOf('.net') > -1) {
    return true;
  }
  return false;
};

exports.isUrlInList = function(url){
  var list = fs.readFileSync(exports.paths.list, { encoding: 'utf8'} );
  if (list.indexOf(url) > -1) {
    return true;
  }
  return false;
};

exports.addUrlToList = function(url){
  fs.appendFileSync(exports.paths.list, url + '\n', {encoding: 'utf8'});
};

exports.isUrlArchived = function(url){
  return fs.existsSync(exports.paths.archivedSites + url);
};

exports.downloadUrls = function(urls){
  for (var u = 0; u < urls.length; u++) {
    var options = {
      host: urls[u],
      port: 80,
      path: '/'
    };
    http.get(options, function(resp){
      resp.on('data', function(chunk){
        var url = this.req._headers.host;
        var html = chunk.toString('utf8');
        exports.writeSiteToFile(url, html);
      });
    }).on('error', function(e){
      console.log("HTTP GET Error: ", e.message);
    });
  }
};

exports.writeSiteToFile = function(url, html) {
  var directory = exports.paths.archivedSites;
  fs.writeFileSync(directory+'/'+url, html);
};
