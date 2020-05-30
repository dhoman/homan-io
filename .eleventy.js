const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const fastglob = require("fast-glob");
const fs = require("fs-extra");

function getWidthFromFilename(filename) {
  var temp = filename.split('_');
  if (temp.length) {
    temp = temp[temp.length-1];
    return temp.split('.')[0];
  }
  return 0;
}

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
  config.addNunjucksAsyncFilter('bgImgFilter', (imgPath, callback) => {
    var temp = imgPath.split('/')[imgPath.split('/').length - 1].split('.')[0];
    var ext = imgPath.split('.')[1];
    fastglob(`./src/site/_optimized_images/*.${ext}`, {
      caseSensitiveMatch: false
    }).then(globs => {
      if (globs.length) {
        var biggest = imgPath;
        for (var i = 0; i < globs.length; i++) {
          if (globs[i].includes(temp)) {
            if (getWidthFromFilename(biggest) < getWidthFromFilename(globs[i])) {
              biggest = globs[i];
            }
          }
        }
        callback(null, `/images/${biggest.split('_optimized_images/')[1]}`);
      }
      callback(null, imgPath);
    });
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