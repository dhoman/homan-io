const fs = require("fs");
const path = require("path");

const postsDir = "./src/site/posts";
const imagesDir = "./src/site/images";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// bgimg is optional -- base.njk falls back to waterfall.jpg -- but picking one
// explicitly is nicer than every post sharing the same default background.
function availableImages() {
  return fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
}

function parseArgs(argv) {
  const opts = { tags: [] };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--tags") {
      opts.tags = (argv[++i] || "").split(",").map((t) => t.trim()).filter(Boolean);
    } else if (arg === "--bgimg") {
      opts.bgimg = argv[++i];
    } else if (arg === "--summary") {
      opts.summary = argv[++i];
    } else if (arg === "--date") {
      opts.date = argv[++i];
    } else {
      rest.push(arg);
    }
  }
  opts.title = rest.join(" ").trim();
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (!opts.title) {
  console.error(`
Usage: npm run new-post -- "My Post Title" [options]

Options:
  --tags a,b,c     comma separated tags (the "post" tag is added automatically
                   by posts/posts.json, so don't list it here)
  --bgimg name     background image, e.g. panda.jpg (default: picked at random)
  --summary text   short blurb (not rendered by any template, used by the CMS)
  --date YYYY-MM-DD  publish date (default: today)

Available images: ${availableImages().join(", ")}
`);
  process.exit(1);
}

const images = availableImages();
let bgimg = opts.bgimg;
if (bgimg) {
  // allow "panda" or "panda.jpg" or "/images/panda.jpg"
  const bare = bgimg.split("/").pop();
  const match = images.find((f) => f === bare || f.replace(/\.[^.]+$/, "") === bare);
  if (!match) {
    console.error(`Unknown image "${opts.bgimg}". Available: ${images.join(", ")}`);
    process.exit(1);
  }
  bgimg = match;
} else {
  bgimg = images[Math.floor(Math.random() * images.length)];
}

const slug = slugify(opts.title);
const filePath = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Refusing to overwrite existing post: ${filePath}`);
  process.exit(1);
}

const tagLines = opts.tags.length
  ? opts.tags.map((t) => `  - ${t}`).join("\n")
  : "  - idk";

const frontmatter = `---
title: ${opts.title}
summary: ${opts.summary || "ramblings"}
date: ${opts.date || today()}
tags:
${tagLines}
layout: layouts/post.njk
bgimg: /images/${bgimg}
---

Write the post here.
`;

fs.writeFileSync(filePath, frontmatter);

console.log(`
Created ${filePath}

  url:    /posts/${slug}/
  bgimg:  /images/${bgimg}
  tags:   ${opts.tags.length ? opts.tags.join(", ") : "idk"}

Run "npm run dev" and it'll show up at http://localhost:8080/posts/${slug}/
`);
