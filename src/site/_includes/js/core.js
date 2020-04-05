
// var imagePath = "{{ '/images/waterfall.jpg' }}";
var imagePath = document.getElementById("bg-img").src;
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

function glitchImage(params) {
  loadImage( imagePath, function ( img ) {
    glitch( params )
      .fromImage( img )
      .toDataURL()
      .then( function( dataURL ) {
        var imageEl = new Image();
        imageEl.src = dataURL;
        if(glitchBgContainerEl.childNodes.length) {
          // we have to remove and replace the image element because if we simply updated the data url there'd be a memory leak
          glitchBgContainerEl.replaceChild(imageEl, glitchBgContainerEl.childNodes[0]);
        } else {
          glitchBgContainerEl.appendChild(imageEl);
        }
      });
  });
}

addEvent(window, 'blur', function(event) {
  glitchImage(getRandomParams());
});

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
  imagePath = document.getElementById("bg-img").src;
  glitchImage(getRandomParams());
}
if (glitchImg.complete) {
  loaded()
} else {
  glitchImg.addEventListener('load', loaded)
}
