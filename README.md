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

### Getting started

```bash

# clone this repository
git clone git@https://github.com/dhoman/homan-io

# go to the working directory
cd homan-io

# install dependencies
npm install

# start a local build server with hot reloading
npm run start
```

### Performance tests

```bash
# will run lighthouse from the command line just like eleventy would (but stores the results and some additional info besides just the metrics into a json file (i don't recommend running this with too many sites in your sites folder))
npm run lighthouse

# will run lighthouse and generate a detailed report into an html file for each site
npm run ligthouse-html
```