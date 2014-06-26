var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
  // does file exist in directory?
  return fs.existsSync(exports.paths.archivedSites + url);
};

exports.downloadUrls = function(url){
  var httpAddress = 'http://' + url; // watch regex on '//'
  // download function
  // start a connection with http.request   (or request module)
  // parse the chunked data response
  // check if directory exists
  // if yes write to it
  // if not create it and pass data
};
