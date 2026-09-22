const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const fastglob = require("fast-glob");
const fs = require("fs-extra");

// Optimized variants are named <name>_<width>.<ext>. Returns the width as a
// number, or 0 when the file has no width suffix (i.e. it is an original).
function getWidthFromFilename(filename) {
  const match = filename.match(/_(\d+)\.[a-z0-9]+$/i);
  return match ? parseInt(match[1], 10) : 0;
}

// Largest optimized variant the background image will use. The image renders at
// 768px tall, so 1200 wide is plenty for 1x and fine for 2x without shipping the
// 1600px variant (roughly double the bytes).
const MAX_BG_WIDTH = 1200;

module.exports = function(config) {
  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');

  // ### FILTERS ###
  // Add some utility filters
  config.addFilter("squash", require("./src/utils/filters/squash.js") );
  config.addFilter("dateDisplay", require("./src/utils/filters/date.js") );
  config.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });
  config.addFilter('photoDescriptor', (imgPath) => {
    var temp = imgPath.split('/');
    return temp[temp.length-1].split('.')[0];
  });
  // Given an original like /images/foo.jpg, return the largest optimized variant
  // (/images/foo_<width>.jpg) up to MAX_BG_WIDTH, or the original if none exist.
  config.addNunjucksAsyncFilter('bgImgFilter', (imgPath, callback) => {
    const base = imgPath.split('/').pop();
    const dot = base.lastIndexOf('.');
    const name = base.slice(0, dot);
    const ext = base.slice(dot + 1);
    fastglob(`./src/site/_optimized_images/${name}_*.${ext}`, {
      caseSensitiveMatch: false
    }).then(globs => {
      let best = null;
      let bestWidth = 0;
      for (const g of globs) {
        const w = getWidthFromFilename(g);
        if (w > bestWidth && w <= MAX_BG_WIDTH) {
          best = g;
          bestWidth = w;
        }
      }
      if (best) {
        callback(null, `/images/${best.split('_optimized_images/')[1]}`);
      } else {
        callback(null, imgPath);
      }
    }).catch(err => callback(err));
  })

  config.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  config.addFilter("first", function(items, number) {
    if (items && items.length) {
      return items.slice(0, number);
    }
    return items;
  });
  config.addFilter("last", function(items, number) {
    if (items && items.length) {
      return items.slice(items.length - number);
    }
    return items;
  });
  // compress and combine js files
  config.addFilter("jsmin", function(code) {
    const UglifyJS = require("uglify-js");
    let minified = UglifyJS.minify(code);
      if( minified.error ) {
          console.log("UglifyJS error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  // ### Plugins ###
  config.addPlugin(syntaxHighlight);
  config.addPlugin(rssPlugin);



  // minify the html output
  config.addTransform("htmlmin", require("./src/utils/minify-html.js"));



  // pass some assets right through
  config.addPassthroughCopy("./src/site/images");
  config.addPassthroughCopy({"src/site/_optimized_images/*.(jpg|webp)": "images"});
  config.addPassthroughCopy("./src/site/files");
  config.addPassthroughCopy("./src/site/admin");
  config.setDataDeepMerge(true);

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: '_data'
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    pathPrefix: '/',
    passthroughFileCopy: true,
  };
};