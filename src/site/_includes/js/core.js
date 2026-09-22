
// var imagePath = "{{ '/images/waterfall.jpg' }}";
var imagePath = document.getElementById("bg-img").src;
var doneLoading = false;
// utility functions
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

function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


var glitchBgContainerEl = document.getElementById( 'glitch-bg' );

function getPhotoDescriptor(imgPath) {
  var temp = imgPath.split('/');
  return temp[temp.length-1].split('.')[0];
}

function glitchImage(params) {
  loadImage( imagePath, function ( img ) {
    glitch( params )
      .fromImage( img )
      .toDataURL()
      .then( function( dataURL ) {
        var imageEl = new Image();
        imageEl.src = dataURL;
        imageEl.alt = 'A glitched photo of ' + getPhotoDescriptor(imagePath);
        if (glitchBgContainerEl.childNodes.length) {
          // we have to remove and replace the image element because if we simply updated the data url there'd be a memory leak
          glitchBgContainerEl.replaceChild(imageEl, glitchBgContainerEl.childNodes[0]);
        } else {
          glitchBgContainerEl.appendChild(imageEl);
        }
      });
  });
}

addEvent(window, 'blur', function(event) {
  if (doneLoading) {
    glitchImage(getRandomParams());
  }
});

// Scroll triggers: any element with class "glitch-trigger" fires one glitch the
// first time it passes through the middle band of the viewport. Nothing is set up
// until the user actually scrolls, so page load (and Lighthouse/Speedlify) never
// pays for this.
var GLITCH_GAP_MS = 900;       // minimum time between scroll-triggered glitches
var pendingGlitches = 0;
var glitchTimer = null;

function drainGlitchQueue() {
  if (glitchTimer || pendingGlitches <= 0) {
    return;
  }
  pendingGlitches--;
  if (doneLoading) {
    glitchImage(getRandomParams());
  }
  glitchTimer = setTimeout(function() {
    glitchTimer = null;
    drainGlitchQueue();
  }, GLITCH_GAP_MS);
}

function queueGlitch() {
  pendingGlitches++;
  drainGlitchQueue();
}

function setupScrollTriggers() {
  var triggers = document.querySelectorAll('.glitch-trigger');
  if (!triggers.length || !('IntersectionObserver' in window)) {
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        observer.unobserve(entries[i].target);
        queueGlitch();
      }
    }
  }, {
    // shrink the root to the middle 50% of the viewport so a trigger fires as it
    // scrolls through the centre, not the moment it peeks in at the bottom
    rootMargin: '-25% 0px -25% 0px',
    threshold: 0
  });
  for (var i = 0; i < triggers.length; i++) {
    observer.observe(triggers[i]);
  }
}

function onFirstScroll() {
  window.removeEventListener('scroll', onFirstScroll);
  setupScrollTriggers();
}
window.addEventListener('scroll', onFirstScroll, { passive: true });

function getRandomParams() {
  var params = {
    amount:     scale(Math.random(), 0, 1, 10, 60),
    iterations: scale(Math.random(), 0, 1, 5, 35),
    quality:    scale(Math.random(), 0, 1, 10, 60),
    seed:       scale(Math.random(), 0, 1, 0, 100)
  };
  return params;
}
var glitchImg = document.getElementById('bg-img');
function loaded() {
  doneLoading = true;
}
if (glitchImg.complete) {
  loaded()
} else {
  glitchImg.addEventListener('load', loaded)
}
