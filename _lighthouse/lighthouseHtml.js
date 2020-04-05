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