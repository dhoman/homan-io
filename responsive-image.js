// stolen from https://gist.github.com/cloudsociety/fffe82b6a2e9797f663fa77f734ccf98
// ty @dave__cross
const sharp = require("sharp");
const path = require("path");

module.exports = async function(file_name, outputPath, passThroughFolder = '') {
  const { name: filename, ext } = path.parse(file_name);
  console.log(JSON.stringify({filename, ext, outputPath, file_name, passThroughFolder}));
  let webpSrcSet = "";
  const srcSet = [];
    // origSrcSet = "";

  try {
    const sharpImage = sharp(path.resolve(file_name));
    console.log(path.resolve(file_name));
    const { width } = await sharpImage.metadata();

    const maxWidth = 800;
    let outputWidths = [
      maxWidth,
      maxWidth / 4,
      maxWidth / 2,
      maxWidth * 1.5,
      maxWidth * 2
    ];
    outputWidths = outputWidths
      .sort((a, b) => a - b)
      .filter(size => size < width);

    // In Gatsby's version, we'd also add the original, but
    // 11ty passes that image through for us, saving us a step.

    for (const outputWidth of outputWidths) {
      await sharpImage
        .clone()
        .resize({ width: outputWidth })
        .toFile(
          path.resolve(outputPath, `${filename}_${outputWidth}${ext}`)
        );
      // Need to account for different routes.
      srcSet.push({filename: `${filename}_${outputWidth}${ext}`, width: outputWidth})
      // origSrcSet += `${filename}_${outputWidth}${ext} ${outputWidth}w,`;
      await sharpImage
        .clone()
        .resize({ width: outputWidth })
        .webp()
        .toFile(
          path.resolve(outputPath, `${filename}_${outputWidth}.webp`)
        );
      // Need to account for different routes.
      webpSrcSet += `${passThroughFolder}${filename}_${outputWidth}.webp ${outputWidth}w,`;
    }
  } catch (err) {
    console.log("nope", err);
    return null;
  }
  const replaceCamelCaseWithSpaces = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); });
  }
  /*
      <img src="${filename}${ext}" srcset="${origSrcSet}" alt="${replaceCamelCaseWithSpaces(filename)}"/>
  */
  return `<picture>
      <source srcset="${webpSrcSet}" type="image/webp">
      <img src="${passThroughFolder}${srcSet[0].filename}" srcset="${srcSet.map(x => `${passThroughFolder}${x.filename} ${x.width}w`).join(',')}" alt="${replaceCamelCaseWithSpaces(filename)}"/>
    </picture>`;
};