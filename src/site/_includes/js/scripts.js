var imagePath=document.getElementById("bg-img").src;function loadImage(t,e){var n=new Image;n.onload=function(){e(n)},n.src=t}function addEvent(t,e,n){t.attachEvent?(t["e"+e+n]=n,t[e+n]=function(){t["e"+e+n](window.event)},t.attachEvent("on"+e,t[e+n])):t.addEventListener(e,n,!1)}function getScrollY(){var t=0;return"number"==typeof window.pageYOffset?t=window.pageYOffset:document.body&&document.body.scrollTop&&(t=document.body.scrollTop),t}function scale(t,e,n,r,a){return(t-e)*(a-r)/(n-e)+r}var glitchBgContainerEl=document.getElementById("glitch-bg");function glitchImage(e){loadImage(imagePath,function(t){glitch(e).fromImage(t).toDataURL().then(function(t){var e=new Image;e.src=t,glitchBgContainerEl.childNodes.length?glitchBgContainerEl.replaceChild(e,glitchBgContainerEl.childNodes[0]):glitchBgContainerEl.appendChild(e)})})}function getRandomParams(){return{amount:scale(Math.random(),0,1,10,60),iterations:scale(Math.random(),0,1,5,35),quality:scale(Math.random(),0,1,10,60),seed:scale(Math.random(),0,1,0,100)}}addEvent(window,"blur",function(t){glitchImage(getRandomParams())});var glitchImg=document.getElementById("bg-img");function loaded(){imagePath=document.getElementById("bg-img").src,glitchImage(getRandomParams())}glitchImg.complete?loaded():glitchImg.addEventListener("load",loaded),function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.glitch=e()}(this,function(){"use strict";function g(a){return"object"!=typeof(a=function(t){var e=!1;if(void 0!==t)try{e=JSON.parse(JSON.stringify(t))}catch(t){}return e}(a))&&(a={}),Object.keys(i).filter(function(t){return"iterations"!==t}).forEach(function(t){var e,n,r;"number"!=typeof a[t]||isNaN(a[t])?a[t]=i[t]:a[t]=(e=a[t],r=100,e<(n=0)?n:r<e?r:e),a[t]=Math.round(a[t])}),("number"!=typeof a.iterations||isNaN(a.iterations)||a.iterations<=0)&&(a.iterations=i.iterations),a.iterations=Math.round(a.iterations),a}function p(t){if(t instanceof HTMLImageElement){if(!t.naturalWidth||!t.naturalHeight||!1===t.complete)throw new Error("This this image hasn't finished loading: "+t.src);var e=new b(t.naturalWidth,t.naturalHeight),n=e.getContext("2d");n.drawImage(t,0,0,e.width,e.height);var r=n.getImageData(0,0,e.width,e.height);return r.data&&r.data.length&&(void 0===r.width&&(r.width=t.naturalWidth),void 0===r.height&&(r.height=t.naturalHeight)),r}throw new Error("This object does not seem to be an image.")}function a(r){return new Promise(function(t,e){var n=new o;n.onload=function(){t(n)},n.onerror=function(t){e(t)},n.src=r})}function m(t,e,n,r){a(t).then(n,r)}function u(t){return{width:t.width||t.naturalWidth,height:t.height||t.naturalHeight}}function v(t,e,s,n){a(t).then(function(t){var e,n,r,a,i=u(t),o=(e=t,n=u(e),r=new b(n.width,n.height),a=r.getContext("2d"),a.drawImage(e,0,0,n.width,n.height),{canvas:r,ctx:a}).ctx.getImageData(0,0,i.width,i.height);o.width||(o.width=i.width),o.height||(o.height=i.height),s(o)},n)}function $(){throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs")}var i={amount:35,iterations:20,quality:30,seed:25},b=function(t,e){void 0===t&&(t=300),void 0===e&&(e=150),this.canvasEl=document.createElement("canvas"),this.canvasEl.width=t,this.canvasEl.height=e,this.ctx=this.canvasEl.getContext("2d")},t={width:{configurable:!0},height:{configurable:!0}};b.prototype.getContext=function(){return this.ctx},b.prototype.toDataURL=function(t,e,n){if("function"!=typeof n)return this.canvasEl.toDataURL(t,e);n(this.canvasEl.toDataURL(t,e))},t.width.get=function(){return this.canvasEl.width},t.width.set=function(t){this.canvasEl.width=t},t.height.get=function(){return this.canvasEl.height},t.height.set=function(t){this.canvasEl.height=t},Object.defineProperties(b.prototype,t),b.Image=Image;var o=b.Image;"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach(function(t,e){});var e,c=Object.getOwnPropertySymbols,h=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable,y=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(t){r[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var n,r,a=arguments,i=function(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}(t),o=1;o<arguments.length;o++){for(var s in n=Object(a[o]))h.call(n,s)&&(i[s]=n[s]);if(c){r=c(n);for(var u=0;u<r.length;u++)f.call(n,r[u])&&(i[r[u]]=n[r[u]])}}return i},q="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};return((e={exports:{}}).exports=function(){function c(t){return"function"==typeof t}function e(){var t=setTimeout;return function(){return t(n,1)}}function n(){for(var t=0;t<I;t+=2)(0,x[t])(x[t+1]),x[t]=void 0,x[t+1]=void 0;I=0}function s(t,e){var n=arguments,r=this,a=new this.constructor(h);void 0===a[R]&&b(a);var i,o=r._state;return o?(i=n[o-1],O(function(){return v(o,a,i,r._result)})):p(r,a,t,e),a}function u(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(h);return l(e,t),e}function h(){}function o(t){try{return t.then}catch(t){return N.error=t,N}}function f(t,e,n){var r,a,i,o;e.constructor===t.constructor&&n===s&&e.constructor.resolve===u?(i=t,(o=e)._state===U?d(i,o._result):o._state===k?g(i,o._result):p(o,void 0,function(t){return l(i,t)},function(t){return g(i,t)})):n===N?(g(t,N.error),N.error=null):void 0===n?d(t,e):c(n)?(r=e,a=n,O(function(e){var n=!1,t=function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}(a,r,function(t){n||(n=!0,r!==t?l(e,t):d(e,t))},function(t){n||(n=!0,g(e,t))},e._label);!n&&t&&(n=!0,g(e,t))},t)):d(t,e)}function l(t,e){var n;t===e?g(t,new TypeError("You cannot resolve a promise with itself")):"function"==typeof(n=e)||"object"==typeof n&&null!==n?f(t,e,o(e)):d(t,e)}function r(t){t._onerror&&t._onerror(t._result),m(t)}function d(t,e){t._state===S&&(t._result=e,t._state=U,0!==t._subscribers.length&&O(m,t))}function g(t,e){t._state===S&&(t._state=k,t._result=e,O(r,t))}function p(t,e,n,r){var a=t._subscribers,i=a.length;t._onerror=null,a[i]=e,a[i+U]=n,a[i+k]=r,0===i&&t._state&&O(m,t)}function m(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,a=void 0,i=t._result,o=0;o<e.length;o+=3)r=e[o],a=e[o+n],r?v(n,r,a,i):a(i);t._subscribers.length=0}}function t(){this.error=null}function v(t,e,n,r){var a=c(n),i=void 0,o=void 0,s=void 0,u=void 0;if(a){if((i=function(t,e){try{return t(e)}catch(t){return H.error=t,H}}(n,r))===H?(u=!0,o=i.error,i.error=null):s=!0,e===i)return void g(e,new TypeError("A promises callback cannot return that same promise."))}else i=r,s=!0;e._state!==S||(a&&s?l(e,i):u?g(e,o):t===U?d(e,i):t===k&&g(e,i))}function b(t){t[R]=W++,t._state=void 0,t._result=void 0,t._subscribers=[]}function a(t,e){this._instanceConstructor=t,this.promise=new t(h),this.promise[R]||b(this.promise),j(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?d(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&d(this.promise,this._result))):g(this.promise,new Error("Array Methods must be provided an Array"))}function y(t){this[R]=W++,this._result=this._state=void 0,this._subscribers=[],h!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof y?function(e,t){try{t(function(t){l(e,t)},function(t){g(e,t)})}catch(t){g(e,t)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}var i,w,_,E,j=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},I=0,M=void 0,D=void 0,O=function(t,e){x[I]=t,x[I+1]=e,2===(I+=2)&&(D?D(n):T())},A="undefined"!=typeof window?window:void 0,P=A||{},B=P.MutationObserver||P.WebKitMutationObserver,C="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),L="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,x=new Array(1e3),T=void 0;T=C?function(){return process.nextTick(n)}:B?(w=0,_=new B(n),E=document.createTextNode(""),_.observe(E,{characterData:!0}),function(){E.data=w=++w%2}):L?((i=new MessageChannel).port1.onmessage=n,function(){return i.port2.postMessage(0)}):void 0===A?function(){try{var t=$();return void 0!==(M=t.runOnLoop||t.runOnContext)?function(){M(n)}:e()}catch(t){return e()}}():e();var R=Math.random().toString(36).substring(16),S=void 0,U=1,k=2,N=new t,H=new t,W=0;return a.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===S&&n<t;n++)this._eachEntry(e[n],n)},a.prototype._eachEntry=function(e,t){var n=this._instanceConstructor,r=n.resolve;if(r===u){var a=o(e);if(a===s&&e._state!==S)this._settledAt(e._state,t,e._result);else if("function"!=typeof a)this._remaining--,this._result[t]=e;else if(n===y){var i=new n(h);f(i,e,a),this._willSettleAt(i,t)}else this._willSettleAt(new n(function(t){return t(e)}),t)}else this._willSettleAt(r(e),t)},a.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===S&&(this._remaining--,t===k?g(r,n):this._result[e]=n),0===this._remaining&&d(r,this._result)},a.prototype._willSettleAt=function(t,e){var n=this;p(t,void 0,function(t){return n._settledAt(U,e,t)},function(t){return n._settledAt(k,e,t)})},y.all=function(t){return new a(this,t).promise},y.race=function(a){var i=this;return new i(j(a)?function(t,e){for(var n=a.length,r=0;r<n;r++)i.resolve(a[r]).then(t,e)}:function(t,e){return e(new TypeError("You must pass an array to race."))})},y.resolve=u,y.reject=function(t){var e=new this(h);return g(e,t),e},y._setScheduler=function(t){D=t},y._setAsap=function(t){O=t},y._asap=O,y.prototype={constructor:y,then:s,catch:function(t){return this.then(null,t)}},y.polyfill=function(){var t=void 0;if(void 0!==q)t=q;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=y},y.Promise=y}(),e.exports).polyfill(),function(r){function t(){var t=y({},f);return i||y(t,l),t}function e(){var t=y({},f);return c||y(t,d),t}function o(t){return t}function n(n,r,a){return i=function(){return new Promise(function(t,e){if(a)n(r,t,e);else if(n===o)t(r);else try{t(n(r,t,e))}catch(t){e(t)}})},s()?u():e()}function a(r,a,i){return c=function(n){return new Promise(function(t,e){i?r(n,a,t,e):r===o?t(n):r(n,a).then(t,e)})},s()?u():t()}function s(){return i&&c}function u(){return new Promise(function(e,n){i().then(function(t){return n=t,o=r,new Promise(function(t,e){var a,i;(a=n,i=o.quality,new Promise(function(t,e){if((r=a)&&"number"==typeof r.width&&"number"==typeof r.height&&r.data&&"number"==typeof r.data.length&&"object"==typeof r.data){var n=new b(a.width,a.height);n.getContext("2d").putImageData(a,0,0),t(n.toDataURL("image/jpeg",i/100))}else e(new Error("object is not valid imageData"));var r})).then(function(t){return r=n,a=t,i=o,new Promise(function(e,n){h.addEventListener("message",function(t){t.data&&t.data.base64URL?e(t.data.base64URL):n(t.data&&t.data.err?t.data.err:t)}),h.postMessage({params:i,base64URL:a,imageData:r,imageDataWidth:r.width,imageDataHeight:r.height})});var r,a,i},e).then(t,e)});var n,o},n).then(function(t){c(t).then(e,n)},n)})}r=g(r);var i,c,h=new Worker(URL.createObjectURL(new Blob(['function isImageData(a){return a&&"number"==typeof a.width&&"number"==typeof a.height&&a.data&&"number"==typeof a.data.length&&"object"==typeof a.data}function base64ToByteArray(a){for(var e,s=[],t=23,r=a.length;t<r;t++){var i=reversedBase64Map[a.charAt(t)];switch((t-23)%4){case 1:s.push(e<<2|i>>4);break;case 2:s.push((15&e)<<4|i>>2);break;case 3:s.push((3&e)<<6|i)}e=i}return s}function jpgHeaderLength(a){for(var e=417,s=0,t=a.length;s<t;s++)if(255===a[s]&&218===a[s+1]){e=s+2;break}return e}function glitchByteArray(a,e,s,t){for(var r=jpgHeaderLength(a),i=a.length-r-4,p=s/100,n=e/100,h=0;h<t;h++){var g=i/t*h|0,o=g+((i/t*(h+1)|0)-g)*n|0;o>i&&(o=i),a[~~(r+o)]=~~(256*p)}return a}function byteArrayToBase64(a){for(var e,s,t=["data:image/jpeg;base64,"],r=0,i=a.length;r<i;r++){var p=a[r];switch(e=r%3){case 0:t.push(base64Map$1[p>>2]);break;case 1:t.push(base64Map$1[(3&s)<<4|p>>4]);break;case 2:t.push(base64Map$1[(15&s)<<2|p>>6]),t.push(base64Map$1[63&p])}s=p}return 0===e?(t.push(base64Map$1[(3&s)<<4]),t.push("==")):1===e&&(t.push(base64Map$1[(15&s)<<2]),t.push("=")),t.join("")}function glitchImageData(a,e,s){if(isImageData(a))return byteArrayToBase64(glitchByteArray(base64ToByteArray(e),s.seed,s.amount,s.iterations));throw new Error("glitchImageData: imageData seems to be corrupt.")}function fail(a){self.postMessage({err:a.message||a})}function success(a){self.postMessage({base64URL:a})}var base64Chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",base64Map=base64Chars.split(""),reversedBase64Map$1={};base64Map.forEach(function(a,e){reversedBase64Map$1[a]=e});var maps={base64Map:base64Map,reversedBase64Map:reversedBase64Map$1},reversedBase64Map=maps.reversedBase64Map,base64Map$1=maps.base64Map;onmessage=function(a){var e=a.data.imageData,s=a.data.params,t=a.data.base64URL;if(e&&t&&s)try{void 0===e.width&&"number"==typeof a.data.imageDataWidth&&(e.width=a.data.imageDataWidth),void 0===e.height&&"number"==typeof a.data.imageDataHeight&&(e.height=a.data.imageDataHeight),success(glitchImageData(e,t,s))}catch(a){fail(a)}else fail(a.data.imageData?"Parameters are missing.":"ImageData is missing.");self.close()};'],{type:"text/javascript"}))),f={getParams:function(){return r},getInput:t,getOutput:e},l={fromImageData:function(t){return n(o,t)},fromImage:function(t){return n(p,t)}},d={toImage:function(t){return a(m,t,!0)},toDataURL:function(t){return a(o)},toImageData:function(t){return a(v,t,!0)}};return t()}});