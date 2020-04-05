
module.exports = class ResultLogger {
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