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

`bgimg` is optional — `base.njk` falls back to `waterfall.jpg` if you leave it out.

### Adding a new background image

Drop it in `src/site/images/`, then generate the responsive variants:

```bash
npm run optimize-images
```

This writes `_200/_400/_800` jpg + webp variants into `src/site/_optimized_images/`, which
`.eleventy.js` passes through to `/images/`. The `bgImgFilter` in the config then picks the
largest matching variant at build time.

### Performance tests

```bash
# will run lighthouse from the command line just like eleventy would (but stores the results and some additional info besides just the metrics into a json file (i don't recommend running this with too many sites in your sites folder))
npm run lighthouse

# will run lighthouse and generate a detailed report into an html file for each site
npm run ligthouse-html
```