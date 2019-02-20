
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

  var waterfallContainerEl = document.getElementById( 'waterfall' );
  
  function glitchImage(params) {
      console.log('glitchParams: ' + JSON.stringify(params));
      latestGlitch = Date.now();
      loadImage( imagePath, function ( img ) {
        glitch( params )
          .fromImage( img )
          .toDataURL()
          .then( function( dataURL ) {
            var imageEl = new Image();
            //imageEl.class = 'waterfall';
            imageEl.src = dataURL;
            //$('.waterfall').replaceWith( imageEl );
            //$('.waterfall').css('background-image',  'url('+dataURL+')');
            //var imageEl = new Image();
            //imageEl.src = dataURL;
            if(waterfallContainerEl.childNodes.length) {
              waterfallContainerEl.replaceChild(imageEl, waterfallContainerEl.childNodes[0]);
            } else {
              waterfallContainerEl.appendChild(imageEl);
            }
          });
      });
  }

  addEvent(window, 'scroll', function(event) {
    var y = getScrollY();
    if (Math.abs(lastestY - y) > 50) {
      lastestY = y;
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
  setTimeoutForGlitch();
  var lastestY = 0;
  var latestGlitch = Date.now();

  var params = {
    amount:     20,
    iterations: 40,
    quality:    50,
    seed:       25
  };
  glitchImage(params)