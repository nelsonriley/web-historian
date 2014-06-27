// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archive = require('../helpers/archive-helpers');

// **test by running this js file from the command line

// fetch urls, dowload/archive each
archive.readListOfUrls(archive.downloadUrls);


// setting up chron job in 5 minutes
// crontab -e    // to create a new crontab file
// crontab -l    // to view current crontab files
// Argument 1: Minute (0 - 59)
// Argument 2: Hour (0 - 23)
// Argument 3: Day of Month (1 - 31)
// Argument 4: Month (1-12)
// Argument 5: Day of Week (0 - 6) Sunday = 0
// Argument 6: Command
//
// 3 parts : chron instructions - node path - file path
// */1* * * *
// /Users/student/.nvm/v0.10.26/bin/node     *find via command line:  which node
// /Users/student/Code/nelsonriley/2014-06-web-historian/workers/htmlfetcher.js

// EXACT line for Chron Job
// */1 * * * * /Users/student/.nvm/v0.10.26/bin/node /Users/student/Code/nelsonriley/2014-06-web-historian/workers/htmlfetcher.js
