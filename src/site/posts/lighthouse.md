---
title: Lighthouse Setup
summary: (I made a thing my website but useful for others (and others who care about the 11ty leader board))
date: 2020-04-04
tags:
  - eleventy
  - learning
  - site
layout: layouts/post.njk
bgimg: /images/possum.jpg
---

I added a couple of files to my repo based off of the scripts that <a href="https://twitter.com/zachleat">@zachleat</a> made to write the leadership board for <a href="https://www.11ty.dev/docs/sites/">https://www.11ty.dev/docs/sites/</a> but I think some other people might benefit / find this useful

so without further ado here are the modifications I made to get this working on my repo (note a lot of these steps can be accomplished by coping my '_lighthouse' folder in my github repo at <a href="https://github.com/dhoman/homan-io">https://github.com/dhoman/homan-io</a>)
```javascript
// changes to package.json
  ...
  "scripts": {
    ...
    "lighthouse": "node ./_lighthouse/lighthouse.js",
    "lighthouse-html": "node ./_lighthouse/lighthouseHtml.js"
  },
  ...
  "devDependencies": {
    ...
    "chrome-launcher": "^0.13.0",
    "fast-glob": "^3.2.2",
    "fs-extra": "^8.1.0",
    "lighthouse": "^5.6.0"
  },
```
you could either run

npm install --save-dev chrome-launcher fast-glob fs-extra lighthouse

or copy paste the above (then run a 'npm install'), but either way you are going to have to manually add the scripts for lighthouse and lighthouse-html to your package.json

Now these commands are going to be looking for a couple of files in a '_lighthouse' folder that you are going to have create
you could just copy paste the folder from my <a href="https://github.com/dhoman/homan-io/tree/master/_lighthouse">repo</a>repo or I'll lay out the files and their contents below

```javascript
// _lighthouse/lighthouse.js
const fastglob = require("fast-glob");
const fs = require("fs-extra");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

// in the original script, number of runs is set to 3
const NUMBER_OF_RUNS = 1;
const folderPath = "./_lighthouse/";

async function runLighthouse(urls) {
  let opts = {
    onlyCategories: ["performance"]
  };
  let config = null;
  let resultLog = new ResultLogger();

  // SpeedIndex was much lower on repeat runs if we don’t
  // kill the chrome instance between runs of the same site
  for(let j = 0; j < NUMBER_OF_RUNS && urls.length; j++) {
    let count = 0;
    let chrome = await chromeLauncher.launch({chromeFlags: opts.chromeFlags});
    opts.port = chrome.port;

    for(let url of urls) {
      console.log( `(Site ${++count} of ${urls.length}, run ${j+1} of ${NUMBER_OF_RUNS}): ${url}` );
      let rawResult = await lighthouse(url, opts, config).then(results => results.lhr);
      resultLog.add(url, rawResult);
    }

    await chrome.kill();
  }

  return resultLog.getFinalSortedResults();
}
class ResultLogger {
  constructor() {
    this.results = {};
  }

  static sortResultData(a, b) {
    if(b.lighthouseScore === a.lighthouseScore) {
      return a.speedIndex - b.speedIndex;
    }
    return b.lighthouseScore - a.lighthouseScore
  }


  add(url, rawResult) {
    if(!this.results[url]) {
      this.results[url] = [];
    }
    this.results[url].push(this.mapResult(rawResult));
  }

  mapResult(result) {
    if(result.requestedUrl.startsWith("https://github.com/")) {
      return {
        url: result.requestedUrl
      };
    }

    return {
      url: result.requestedUrl,
      finalUrl: result.finalUrl,
      lighthouseScore: result.categories.performance.score,
      firstContentfulPaint: result.audits['first-contentful-paint'].numericValue,
      firstMeaningfulPaint: result.audits['first-meaningful-paint'].numericValue,
      speedIndex: result.audits['speed-index'].numericValue,
	    ...result.audits
    };
  }

  getMedianResultForUrl(url) {
    if(this.results[url] && this.results[url].length) {
      // Log all runs
      // console.log( this.results[url] );
      return this.results[url].filter(() => true).sort(ResultLogger.sortResultData)[Math.floor(this.results[url].length / 2)];
    }
  }

  getFinalSortedResults() {
    let finalResults = [];
    for(let url in this.results) {
      finalResults.push(this.getMedianResultForUrl(url));
    }
    finalResults.sort(ResultLogger.sortResultData).map((entry, index) => {
      entry.rank = index + 1;
      return entry;
    });

    return finalResults;
  }
}

(async () => {
  let urls = new Set();
  let sites = await fastglob('sites/*.json', {
    caseSensitiveMatch: false,
    cwd: folderPath
  });

  for(let site of sites) {
    let siteData = require(`./${site}`);
    if(!siteData.disabled && siteData.url) {
      urls.add(siteData.url);
    }
  }

  let finalUrls = Array.from(urls);
  console.log( `Testing ${finalUrls.length} sites:` );

  let results = await runLighthouse(finalUrls);
  const replacer = (name, val) => {
    if (val && val.toString().startsWith('data:image/jpeg')) {
      return undefined // remove from result
    }
    return val;
  }
  fs.writeFile(`${folderPath}results/results.json`, JSON.stringify(results, replacer, 2));

  console.log( results );
})();
```

```javascript
// _lighthouse/lighthouseHtml.js
const fastglob = require("fast-glob");
const fs = require("fs-extra");
const lighthouse = require("lighthouse");
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const chromeLauncher = require("chrome-launcher");

const NUMBER_OF_RUNS = 1;
const folderPath = "./_lighthouse/";

//https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
const getHostnameFromRegex = (url) => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  return matches && matches[1];
}

async function runLighthouse(urls) {
  let opts = {
    onlyCategories: ["accessibility","best-practices","performance","pwa","seo"]
  };
  let config = null;

  // SpeedIndex was much lower on repeat runs if we don’t
  // kill the chrome instance between runs of the same site
  for(let j = 0; j < NUMBER_OF_RUNS && urls.length; j++) {
    let count = 0;
    let chrome = await chromeLauncher.launch({chromeFlags: opts.chromeFlags});
    opts.port = chrome.port;

    for(let url of urls) {
      console.log( `(Site ${++count} of ${urls.length}, run ${j+1} of ${NUMBER_OF_RUNS}): ${url}` );
      let rawResult = await lighthouse(url, opts, config).then(results => results.lhr);
      const html = ReportGenerator.generateReport(rawResult, 'html');
      fs.writeFile(`${folderPath}results/${getHostnameFromRegex(url).replace('.', '_')}.html`, html);
    }

    await chrome.kill();
  }
}


(async () => {
  let urls = new Set();
  let sites = await fastglob('sites/*.json', {
    caseSensitiveMatch: false,
    cwd: folderPath
  });

  for(let site of sites) {
    let siteData = require(`./${site}`);
    if(!siteData.disabled && siteData.url) {
      urls.add(siteData.url);
    }
  }

  let finalUrls = Array.from(urls);
  console.log( `Testing ${finalUrls.length} sites:` );

  await runLighthouse(finalUrls);

  console.log( 'done' );
})();
```

Just one more file and two more folders, by default this will load and save the results in nested folders in the _lighthouse folder... so you are going to have to make a folder in _lighthouse called sites and another one called results

Once you have that done you are ready to make the final file to get this working


```javascript
// _lighthouse/sites/homan.json
{
	"url": "https://homan.io"
}
```

If it isn't obvious, you are going to want to change the name of that file and the contents of that file to point to your website, the only info that is important is the url (the original script had more info but they are not relevant for our purposes)


Now, once you have this setup, you can run 

'npm run lighthouse' or
'npm run lighthouse-html'

I prefer the lighthouse-html option, it'll run the full lighthouse suite and save the results in the results folder (for each site that was in a json file in that sites folder) which you can then load in your web browser of choice to get detailed info on how it performed and information on what you can do to improve the issues it discovered.
