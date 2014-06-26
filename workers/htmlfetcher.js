// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archive = require('../helpers/archive-helpers');

// **test by running this js file from the command line

// fetch urls, dowload/archive each
archive.readListOfUrls(archive.downloadUrls);
