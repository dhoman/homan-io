const fastglob = require("fast-glob");
const fs = require("fs-extra");
const optImg = require('./responsive-image');

const folderPath = './';
const rawImgPath = `${folderPath}src/site/images`;
const outputImgPath = `${folderPath}src/site/images/opt`;

(async () => {
  // let imgPaths = new Set();
  let imgs = await fastglob(`${rawImgPath}/*.{jpg,jpeg,png}`, {
    caseSensitiveMatch: false,
    cwd: folderPath
  });
  console.log( `optimizing the following images: ${JSON.stringify(imgs)}` );
  let results = [];
  for (let i = 0; i < imgs.length; i++) {
    let result = await optImg(`${imgs[i]}`, outputImgPath, '/images/');
    results.push(result);
  }

  console.log( results );
})();