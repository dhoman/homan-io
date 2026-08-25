# notes to self

## 2026-08-25 — fixed the build on the M-series mac

Everything below in the 2020 section is **obsolete**. `npm install` just works now:

```bash
npm install
npm run dev
```

No `--ignore-scripts`, no Homebrew packages, no node-gyp, no pixman. Verified with a
from-scratch install into an empty directory: 1120 packages, ~23 seconds, zero errors.

### what was actually wrong

The thing breaking `npm install` was the native `canvas` module, pulled in by
`glitch-canvas` (`glitch-canvas@1.1.5` → `canvas@^1.6.7`). That's what wanted pixman/cairo.

But **the build never used `glitch-canvas`.** The glitch effect runs entirely in the browser
off a pre-bundled vendored file that's committed to the repo:

    src/site/_includes/js/glitch-canvas-browser-with-polyfills.min.js

`base.njk` inlines it alongside `core.js` and minifies both into a single `<script>` tag. So
the npm package was dead weight that only ever caused pain. **Removed it. The glitch effect
is unaffected** — confirmed the library is still bundled in the built HTML.

Also removed `jquery`, which was in package.json and referenced by nothing.

### sharp / image optimization

`npm run optimize-images` **works now.** Bumped `sharp` 0.25.2 → 0.35.3.

The old version predated Apple Silicon, so there was no darwin-arm64 binary to download and
it fell back to compiling from source. Modern sharp (0.33+) ships prebuilt platform binaries
as optional deps (`@img/sharp-darwin-arm64`), so there's no build step at all. Running
libvips 8.18.3.

The `responsive-image.js` API calls (`.metadata()` `.clone()` `.resize()` `.webp()`
`.toFile()`) were unchanged across that whole version jump, so it was a drop-in swap.

Note: regenerating images with the new libvips produces byte-different but visually identical
output (±1% file size). Don't be alarmed if `git status` lights up after running it.

### node version

I am **not** using nvm anymore, I'm on **Volta**. There is no ~/.nvm on this machine.
Pinned two ways:

- `package.json` → `"volta": { "node": "22.12.0" }`  ← the one Volta actually reads
- `.nvmrc` → `22.12.0`  ← portability / CI / if I ever go back to nvm

Eleventy 0.10 builds fine on Node 22, which was a pleasant surprise. No need to hunt down an
ancient Node — and old Node (12/14) has no darwin-arm64 builds anyway, so that's a dead end
on this machine regardless.

### bgimg is optional

I thought it was required. It isn't — `base.njk` has an `else` branch that falls back to
`waterfall.jpg`, so a post with no `bgimg` still renders fine. Setting it is just nicer than
every post sharing one background.

### writing a post

```bash
npm run new-post -- "Some Title" --tags eleventy,site --bgimg possum
```

Scaffolds the markdown with correct frontmatter. Filename becomes the URL slug. The `post`
tag is applied automatically by `posts/posts.json`, so don't list it in `--tags`.

### still old, but working

Eleventy is still 0.10.0 (2020) and there are a lot of deprecation warnings on install. All
cosmetic — the build is clean. Upgrading to Eleventy 3.x is a real project for another day;
it would mean rewriting `.eleventy.js`, the filters, and the `styles.11ty.js` postcss
pipeline. Not worth it just to silence warnings.

---

## 2020 — original note (kept for history, superseded by the above)

on a new machine, couldn't npm install (had nvm and node was v12) because I was getitng an error

'''
Package pixman-1 was not found in the pkg-config search path.
Perhaps you should add the directory containing `pixman-1.pc'
to the PKG_CONFIG_PATH environment variable
No package 'pixman-1' found
gyp: Call to 'pkg-config pixman-1 --libs' returned exit status 1 while in binding.gyp. while trying to load binding.gyp
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onCpExit (/Users/dhoman/.nvm/versions/node/v12.16.2/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:351:16)
gyp ERR! stack     at ChildProcess.emit (events.js:310:20)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:275:12)
gyp ERR! System Darwin 19.4.0
gyp ERR! command "/Users/dhoman/.nvm/versions/node/v12.16.2/bin/node" "/Users/dhoman/.nvm/versions/node/v12.16.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "configure" "--fallback-to-build" "--module=/Users/dhoman/Source/homan-io/node_modules/canvas/build/Release/canvas.node" "--module_name=canvas" "--module_path=/Users/dhoman/Source/homan-io/node_modules/canvas/build/Release" "--napi_version=5" "--node_abi_napi=napi" "--napi_build_version=0" "--node_napi_label=node-v72"
gyp ERR! cwd /Users/dhoman/Source/homan-io/node_modules/canvas
gyp ERR! node -v v12.16.2
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok
'''

so 'brew install pixman pango cairo' because of some stackoverflow post (these are image packages and a unicode library?) said to...


  im not going to add their paths
'''
==> icu4c
icu4c is keg-only, which means it was not symlinked into /usr/local,
because macOS provides libicucore.dylib (but nothing else).

If you need to have icu4c first in your PATH run:
  echo 'export PATH="/usr/local/opt/icu4c/bin:$PATH"' >> ~/.zshrc
  echo 'export PATH="/usr/local/opt/icu4c/sbin:$PATH"' >> ~/.zshrc

For compilers to find icu4c you may need to set:
  export LDFLAGS="-L/usr/local/opt/icu4c/lib"
  export CPPFLAGS="-I/usr/local/opt/icu4c/include"

For pkg-config to find icu4c you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/icu4c/lib/pkgconfig"
  '''
but they warned me so i should note it

that didnt work


just do: 'brew install yarn'

then: 'yarn install'

then things will work... not sure if other brew packages were needed... thats for the next fresh computer / install
