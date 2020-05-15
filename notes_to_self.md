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
