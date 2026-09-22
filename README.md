# homan.io

This repo was really spun out of two other base 11ty projects, so before I get too far...

## Major Props
- [EleventyOne](https://github.com/philhawksworth/eleventyone)
- [Eleventy](https://github.com/11ty/eleventy) 
- [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog)
- [@philhawksworth](https://twitter.com/philhawksworth)
- [@zachleat](https://twitter.com/zachleat)

This project scaffold includes:

- Eleventy with a skeleton site and some configs I use regularly
- A date format filter for Nunjucks
- Sass pipeline
- JS pipeline


## Local development

To build the site you need:

- [Node](https://nodejs.org) - to run the build

Node version is pinned to 22.12.0 via [Volta](https://volta.sh) (the `volta` field in
`package.json`), with a matching `.nvmrc` for portability.

### Getting started

```bash

# clone this repository
git clone git@github.com:dhoman/homan-io.git

# go to the working directory
cd homan-io

# install dependencies
npm install

# start a local build server with hot reloading
npm run start
```

### Writing a post

```bash
npm run new-post -- "My Post Title" --tags eleventy,site --bgimg possum
```

This scaffolds a correctly-formed markdown file in `src/site/posts/`, where the filename
becomes the URL slug. Options are all optional except the title:

| flag | meaning |
| --- | --- |
| `--tags a,b` | comma separated tags (`post` is added automatically by `posts/posts.json`) |
| `--bgimg name` | background image; defaults to a random one from `src/site/images/` |
| `--summary text` | short blurb (used by the CMS, not rendered by any template) |
| `--date YYYY-MM-DD` | publish date, defaults to today |

Or write the file by hand — the frontmatter looks like this:

```markdown
---
title: Hello World
summary: ramblings
date: 2019-02-20
tags:
  - idk
layout: layouts/post.njk
bgimg: /images/panda.jpg
---
```

### Background images (`bgimg`)

Every page has a full-bleed background photo behind the content boxes. A post picks its
photo with the `bgimg` front matter key, as a path under `/images/`:

```yaml
bgimg: /images/possum.jpg
```

`bgimg` is optional. `base.njk` falls back to `waterfall.jpg` if it's left out. The key must
be spelled `bgimg` and the extension must match the file in `src/site/images/` exactly
(`.jpg`, not `.jpeg`), otherwise the fallback kicks in, or worse, the page points at a file
that doesn't exist.

At build time the path goes through the `bgImgFilter` in `.eleventy.js`, which swaps the
original for the largest optimized variant it can find in `src/site/_optimized_images/`,
capped at `MAX_BG_WIDTH` (1200px, set at the top of `.eleventy.js`). So `/images/possum.jpg`
becomes `/images/possum_400.jpg` if 400 is the biggest variant that exists, and
`/images/IMG_1234.jpg` becomes `/images/IMG_1234_1200.jpg` for a big phone photo. If no
variants exist the original is used as is. The `<img>` alt text is derived from the file
name, so a readable name beats a camera-generated one.

Both the originals and the optimized folder are passthrough-copied into `dist/images/`.

### Optimizing images

Originals live in `src/site/images/`. Drop a new one in and it gets picked up
automatically: `npm run build` runs the optimizer first via the `prebuild` script in
`package.json`, and since Netlify's build command is `npm run build`, deploys get it too.
You can also run it by hand:

```bash
npm run optimize-images            # only images with no variants yet
npm run optimize-images -- --force # regenerate everything
```

`optimize-images.js` globs every jpg/jpeg/png in the images folder and hands each to
`responsive-image.js`, which uses [sharp](https://sharp.pixelplumbing.com/) to write
resized copies into `src/site/_optimized_images/`. It produces widths of 200, 400, 800,
1200 and 1600 (skipping any wider than the source), each as both jpg and webp, named
`<name>_<width>.<ext>`. Small originals like `panda.jpg` only get 200 and 400; a 4000px phone
photo gets all five.

By default an image is skipped when any `<name>_*.<ext>` variant already exists. The check is
existence rather than modification time because a fresh git clone (Netlify) gives every file
the same timestamp. So if you edit an original in place, or change the sizes in
`responsive-image.js`, run it with `--force`. The optimized folder is committed, which keeps
the build step at a couple of seconds; a full regeneration of all 28 images takes about 20.

Things to know:

- It applies EXIF orientation before resizing (phone photos are often stored sideways with a
  rotate-me tag; resizing would otherwise strip the tag and leave them sideways).
- It reprocesses every image every run. Output is byte-different but visually identical
  across libvips versions, so `git status` will light up on unchanged images. That's fine.
- Only the jpg variant chosen by `bgImgFilter` is referenced by the built HTML today. The
  webp files and smaller sizes are generated and copied but unused until something renders a
  `<picture>` or `srcset`.
- Originals are copied to `dist/` untouched even though nothing links to them, so a folder of
  multi-megabyte camera files inflates the deploy by that much.

### How the glitch effect works

The background photo is glitched in the browser with a vendored copy of
[glitch-canvas](https://github.com/snorpey/glitch-canvas)
(`src/site/_includes/js/glitch-canvas-browser-with-polyfills.min.js`). `base.njk` inlines it
together with `src/site/_includes/js/core.js` and minifies both into one `<script>` tag. The
npm package is deliberately not a dependency; it needed a native canvas build that broke
`npm install` on Apple Silicon.

`core.js` reads the `src` of the `#bg-img` element, loads it into an `Image`, runs
glitch-canvas with random `amount` / `iterations` / `quality` / `seed`, and swaps the
resulting data URL into the `#glitch-bg` container (replacing the element rather than
updating `src`, to avoid a memory leak). Nothing runs at page load, on purpose: the site is
tracked on [Speedlify](https://www.speedlify.dev/site/homan-io/) and glitching during load
tanks the score.

Two things trigger a glitch:

1. **Tab blur.** A `blur` listener on `window` glitches once each time the tab loses focus.
2. **Scrolling past a marker.** On the reader's first `scroll` event (and never before), an
   `IntersectionObserver` is created over every element with the class `glitch-trigger`. Its
   root is shrunk to the middle 50% of the viewport, so a marker fires as it crosses the
   centre of the screen, not the moment it peeks in at the bottom. Each marker fires once
   and is then unobserved. Hits go through a small queue drained 900ms apart
   (`GLITCH_GAP_MS`), so several markers landing in the band together still produce one
   visible glitch each instead of overwriting one another.

Markers in a post are empty divs, written as raw HTML in the markdown at natural
transitions (two or three per post):

```markdown
Some paragraph that sets things up.

<div class="glitch-trigger"></div>

## The next section
```

Use a `div`, not a `span`. Markdown treats a block-level tag as a raw HTML block, but wraps an
inline tag in a `<p>`, and paragraphs get the dark box styling, so a span would render as a
visible empty bar. A CSS rule gives `div.glitch-trigger` a 1px height so the observer has an
edge to intersect.

Pages using `layouts/home.njk` (home, archive, tag pages) set `glitchTriggers: true` in the
layout's front matter, which makes the first three items in the post list triggers, so no
markers are needed there.

### Performance tests

```bash
# will run lighthouse from the command line just like eleventy would (but stores the results and some additional info besides just the metrics into a json file (i don't recommend running this with too many sites in your sites folder))
npm run lighthouse

# will run lighthouse and generate a detailed report into an html file for each site
npm run ligthouse-html
```