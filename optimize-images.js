const fastglob = require("fast-glob");
const path = require("path");
const optImg = require('./responsive-image');

const folderPath = './';
const rawImgPath = `${folderPath}src/site/images`;
const outputImgPath = `${folderPath}src/site/_optimized_images`;

// Runs before every `npm run build` (see the "prebuild" script in package.json), so
// by default it only processes images that have no variants yet. Existence is the
// check rather than mtime because a fresh git clone (e.g. on Netlify) gives every
// file the same timestamp. Pass --force to regenerate everything, e.g. after
// editing an original in place or changing the sizes in responsive-image.js.
const force = process.argv.includes('--force');

(async () => {
  const imgs = await fastglob(`${rawImgPath}/*.{jpg,jpeg,png}`, {
    caseSensitiveMatch: false,
    cwd: folderPath
  });
  const results = [];
  let skipped = 0;
  for (const img of imgs) {
    const { name, ext } = path.parse(img);
    if (!force) {
      const existing = await fastglob(`${outputImgPath}/${name}_*${ext}`, { caseSensitiveMatch: false });
      if (existing.length) {
        skipped++;
        continue;
      }
    }
    console.log(`optimizing ${img}`);
    results.push(await optImg(img, outputImgPath, '/images/'));
  }
  console.log(`optimize-images: ${results.length} processed, ${skipped} skipped (already have variants)${force ? ' [--force]' : ''}`);
})();
