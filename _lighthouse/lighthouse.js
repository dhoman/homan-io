const fastglob = require("fast-glob");
const fs = require("fs-extra");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const ResultLogger = require('./resultLoggerJson.js');

const NUMBER_OF_RUNS = 3;
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
  // fs.writeFile("./_data/fastestSites.json", JSON.stringify(results, null, 2));
  // fs.writeFile("./_data/fastestSitesMeta.json", JSON.stringify({
  //   generated: Date.now()
  // }, null, 2));

  console.log( results );
})();