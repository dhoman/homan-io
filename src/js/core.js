
var imagePath = "{{ '/images/waterfall.jpg' }}";
//var imgContainerEl = document.getElementById( 'homan-img-container' );
//var canvasContainerEl = document.getElementById( 'homan-canvas' );

function loadImage ( src, callback ) {
  var imageEl = new Image();
  imageEl.onload = function () {
    callback( imageEl );
  };
  imageEl.src = src;
}
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else {
    obj.addEventListener( type, fn, false );
  }
}
function getScrollY() {
  var scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
  } else if( document.body && document.body.scrollTop )  {
    //DOM compliant
    scrOfY = document.body.scrollTop;
  } 
  return scrOfY;
}
function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function timeOutGlitch() {
  var currentTime = Date.now();
  if (latestGlitch + 2000 < currentTime) {
    var sin = Math.sin(currentTime);
    var cos = Math.cos(currentTime);
    latestGlitch = currentTime;
    var tempParams = {
      amount: scale(sin, -1, 1, 10, 60),
      iterations: scale(cos, -1, 1, 5, 35),
      quality: scale(sin, -1, 1, 10, 60),
      seed: scale(sin, -1, 1, 0, 100)
    }
    glitchImage(tempParams);
  }
}

function setTimeoutForGlitch() {
  setTimeout(function() {
    timeOutGlitch();
    setTimeoutForGlitch();
  }, Math.random() * 10000);
}

var glitchBgContainerEl = document.getElementById( 'glitch-bg' );
var glitchImgWidth = 0;
function glitchImage(params) {
    console.log('glitchParams: ' + JSON.stringify(params));
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    latestGlitch = Date.now();
    console.log(dw_getWindowDims());
    loadImage( imagePath, function ( img ) {
      glitch( params )
        .fromImage( img )
        .toDataURL()
        .then( function( dataURL ) {
          var imageEl = new Image();
          imageEl.src = dataURL;
          // the new image doesn't always have a width... so store it
          if (glitchImgWidth === 0 && imageEl.width) {
            glitchImgWidth = imageEl.width;
          }
          // if viewport is small, let's center the img
          if (w < glitchImgWidth) {
            imageEl.style.right = '-' + (glitchImgWidth - w )/ 2 + 'px';
            // console.log(imageEl.style);
          }
          if(glitchBgContainerEl.childNodes.length) {
            glitchBgContainerEl.replaceChild(imageEl, glitchBgContainerEl.childNodes[0]);
          } else {
            glitchBgContainerEl.appendChild(imageEl);
          }
        });
    });
}

addEvent(window, 'scroll', function(event) {
  var y = getScrollY();
  if (Math.abs(latestY - y) > 50) {
    latestY = y;
    var sin = Math.sin(y);
    var cos = Math.cos(y);
    var tempParams = {
      amount: scale(sin, -1, 1, 10, 60),
      iterations: scale(cos, -1, 1, 5, 35),
      quality: scale(sin, -1, 1, 10, 60),
      seed: scale(sin, -1, 1, 0, 100)
    }
    glitchImage(tempParams);
  }
});
var latestY = 0;
var latestGlitch = Date.now();

var params = {
  amount:     20,
  iterations: 40,
  quality:    50,
  seed:       25
};

function dw_getWindowDims() {
  var doc = document, w = window;
  var docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
          doc.documentElement: doc.body;
  
  var width = docEl.clientWidth;
  var height = docEl.clientHeight;
  
  // mobile zoomed in?
  if ( w.innerWidth && width > w.innerWidth ) {
      width = w.innerWidth;
      height = w.innerHeight;
  }
  
  return {width: width, height: height};
}
window.onload = function() {
  glitchImage(params);
  setTimeoutForGlitch();
}