// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archive = require('../helpers/archive-helpers');

// **test by running this js file from the command line

// fetch urls, dowload/archive each
archive.readListOfUrls(archive.downloadUrls);


// setting up chron job
//
// 3 parts : chron instructions - node path - file path
// */1* * * *
// /Users/student/.nvm/v0.10.26/bin/node     *find via command line:  which node
// /Users/student/Code/nelsonriley/2014-06-web-historian/workers/htmlfetcher.js

// EXACT line for Chron Job
// */1 * * * * /Users/student/.nvm/v0.10.26/bin/node /Users/student/Code/nelsonriley/2014-06-web-historian/workers/htmlfetcher.js
