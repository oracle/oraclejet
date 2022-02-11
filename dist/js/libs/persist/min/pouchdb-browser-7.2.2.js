!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).PouchDB=e()}((function(){return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[s]={exports:{}};t[s][0].call(f.exports,(function(e){return o(t[s][1][e]||e)}),f,f.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t,n){"use strict";t.exports=function(e){return function(){var t=arguments.length;if(t){for(var n=[],r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}return e.call(this,[])}}},{}],2:[function(e,t,n){},{}],3:[function(e,t,n){
// Copyright Joyent, Inc. and other Node contributors.
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var r=Object.create||function(e){var t=function(){};return t.prototype=e,new t},o=Object.keys||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return n},i=Function.prototype.bind||function(e){var t=this;return function(){return t.apply(e,arguments)}};function s(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=r(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}t.exports=s,
// Backwards-compat with node 0.10.x
s.EventEmitter=s,s.prototype._events=void 0,s.prototype._maxListeners=void 0;
// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var a,u=10;try{var c={};Object.defineProperty&&Object.defineProperty(c,"x",{value:0}),a=0===c.x}catch(e){a=!1}function f(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}
// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function l(e,t,n){if(t)e.call(n);else for(var r=e.length,o=w(e,r),i=0;i<r;++i)o[i].call(n)}function d(e,t,n,r){if(t)e.call(n,r);else for(var o=e.length,i=w(e,o),s=0;s<o;++s)i[s].call(n,r)}function h(e,t,n,r,o){if(t)e.call(n,r,o);else for(var i=e.length,s=w(e,i),a=0;a<i;++a)s[a].call(n,r,o)}function p(e,t,n,r,o,i){if(t)e.call(n,r,o,i);else for(var s=e.length,a=w(e,s),u=0;u<s;++u)a[u].call(n,r,o,i)}function v(e,t,n,r){if(t)e.apply(n,r);else for(var o=e.length,i=w(e,o),s=0;s<o;++s)i[s].apply(n,r)}function y(e,t,n,o){var i,s,a;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((s=e._events)?(
// To avoid recursion in the case that type === "newListener"! Before
// adding it to the listeners, first emit "newListener".
s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),
// Re-assign `events` because a newListener handler could have caused the
// this._events to be assigned to a new object
s=e._events),a=s[t]):(s=e._events=r(null),e._eventsCount=0),a){
// Check for listener leak
if("function"==typeof a?
// Adding the second element, need to change to array.
a=s[t]=o?[n,a]:[a,n]:
// If we've already got an array, just append.
o?a.unshift(n):a.push(n),!a.warned&&(i=f(e))&&i>0&&a.length>i){a.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+a.length+' "'+String(t)+'" listeners added. Use emitter.setMaxListeners() to increase limit.');u.name="MaxListenersExceededWarning",u.emitter=e,u.type=t,u.count=a.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",u.name,u.message)}}else
// Optimize the case of one listener. Don't need the extra array object.
a=s[t]=n,++e._eventsCount;return e}function g(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var e=new Array(arguments.length),t=0;t<e.length;++t)e[t]=arguments[t];this.listener.apply(this.target,e)}}function _(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=i.call(g,r);return o.listener=n,r.wrapFn=o,o}function m(e,t,n){var r=e._events;if(!r)return[];var o=r[t];return o?"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):w(o,o.length):[]}function b(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function w(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}a?Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return u},set:function(e){
// check whether the input is a positive number (whose value is zero or
// greater and not a NaN).
if("number"!=typeof e||e<0||e!=e)throw new TypeError('"defaultMaxListeners" must be a positive number');u=e}}):s.defaultMaxListeners=u,
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return f(this)},s.prototype.emit=function(e){var t,n,r,o,i,s,a="error"===e;if(s=this._events)a=a&&null==s.error;else if(!a)return!1;
// If there is no 'error' event listener then throw.
if(a){if(arguments.length>1&&(t=arguments[1]),t instanceof Error)throw t;// Unhandled 'error' event
// At least give some kind of context to the user
var u=new Error('Unhandled "error" event. ('+t+")");throw u.context=t,u}if(!(n=s[e]))return!1;var c="function"==typeof n;switch(r=arguments.length){
// fast cases
case 1:l(n,c,this);break;case 2:d(n,c,this,arguments[1]);break;case 3:h(n,c,this,arguments[1],arguments[2]);break;case 4:p(n,c,this,arguments[1],arguments[2],arguments[3]);break;
// slower
default:for(o=new Array(r-1),i=1;i<r;i++)o[i-1]=arguments[i];v(n,c,this,o)}return!0},s.prototype.addListener=function(e,t){return y(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return y(this,e,t,!0)},s.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,_(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,_(this,e,t)),this},
// Emits a 'removeListener' event if and only if the listener was removed.
s.prototype.removeListener=function(e,t){var n,o,i,s,a;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(o=this._events))return this;if(!(n=o[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=r(null):(delete o[e],o.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,s=n.length-1;s>=0;s--)if(n[s]===t||n[s].listener===t){a=n[s].listener,i=s;break}if(i<0)return this;0===i?n.shift():
// About 1.5x faster than the two-arg version of Array#splice().
function(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}(n,i),1===n.length&&(o[e]=n[0]),o.removeListener&&this.emit("removeListener",e,a||t)}return this},s.prototype.removeAllListeners=function(e){var t,n,i;if(!(n=this._events))return this;
// not listening for removeListener, no need to emit
if(!n.removeListener)return 0===arguments.length?(this._events=r(null),this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=r(null):delete n[e]),this;
// emit removeListener for all listeners on all events
if(0===arguments.length){var s,a=o(n);for(i=0;i<a.length;++i)"removeListener"!==(s=a[i])&&this.removeAllListeners(s);return this.removeAllListeners("removeListener"),this._events=r(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)
// LIFO order
for(i=t.length-1;i>=0;i--)this.removeListener(e,t[i]);return this},s.prototype.listeners=function(e){return m(this,e,!0)},s.prototype.rawListeners=function(e){return m(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):b.call(e,t)},s.prototype.listenerCount=b,s.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]}},{}],4:[function(e,t,n){"use strict";var r,o,i,s=[e("./nextTick"),e("./queueMicrotask"),e("./mutation.js"),e("./messageChannel"),e("./stateChange"),e("./timeout")],a=-1,u=[],c=!1;function f(){r&&o&&(r=!1,o.length?u=o.concat(u):a=-1,u.length&&l())}
//named nextTick for less confusing stack traces
function l(){if(!r){c=!1,r=!0;for(var e=u.length,t=setTimeout(f);e;){for(o=u,u=[];o&&++a<e;)o[a].run();a=-1,e=u.length}o=null,a=-1,r=!1,clearTimeout(t)}}for(var d=-1,h=s.length;++d<h;)if(s[d]&&s[d].test&&s[d].test()){i=s[d].install(l);break}
// v8 likes predictible objects
function p(e,t){this.fun=e,this.array=t}p.prototype.run=function(){var e=this.fun,t=this.array;switch(t.length){case 0:return e();case 1:return e(t[0]);case 2:return e(t[0],t[1]);case 3:return e(t[0],t[1],t[2]);default:return e.apply(null,t)}},t.exports=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];u.push(new p(e,t)),c||r||(c=!0,i())}},{"./messageChannel":5,"./mutation.js":6,"./nextTick":2,"./queueMicrotask":7,"./stateChange":8,"./timeout":9}],5:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return!e.setImmediate&&void 0!==e.MessageChannel},n.install=function(t){var n=new e.MessageChannel;return n.port1.onmessage=t,function(){n.port2.postMessage(0)}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],6:[function(e,t,n){(function(e){(function(){"use strict";
//based off rsvp https://github.com/tildeio/rsvp.js
//license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js
var t=e.MutationObserver||e.WebKitMutationObserver;n.test=function(){return t},n.install=function(n){var r=0,o=new t(n),i=e.document.createTextNode("");return o.observe(i,{characterData:!0}),function(){i.data=r=++r%2}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return"function"==typeof e.queueMicrotask},n.install=function(t){return function(){e.queueMicrotask(t)}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return"document"in e&&"onreadystatechange"in e.document.createElement("script")},n.install=function(t){return function(){
// Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
// into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
var n=e.document.createElement("script");return n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n),t}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],9:[function(e,t,n){"use strict";n.test=function(){return!0},n.install=function(e){return function(){setTimeout(e,0)}}},{}],10:[function(e,t,n){"function"==typeof Object.create?
// implementation from standard node.js 'util' module
t.exports=function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:
// old school shim for old browsers
t.exports=function(e,t){if(t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}}},{}],11:[function(e,t,n){(function(n){(function(){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var o,i,s=r(e("immediate")),a=e("uuid"),u=r(e("spark-md5")),c=r(e("vuvuzela")),f=r(e("argsarray")),l=r(e("inherits")),d=r(e("events"));function h(e){return"$"+e}function p(e){return e.substring(1)}function v(){this._store={}}function y(e){
// init with an array
if(this._store=new v,e&&Array.isArray(e))for(var t=0,n=e.length;t<n;t++)this.add(e[t])}
// most of this is borrowed from lodash.isPlainObject:
// https://github.com/fis-components/lodash.isplainobject/
// blob/29c358140a74f252aeb08c9eb28bef86f2217d4a/index.js
v.prototype.get=function(e){var t=h(e);return this._store[t]},v.prototype.set=function(e,t){var n=h(e);return this._store[n]=t,!0},v.prototype.has=function(e){return h(e)in this._store},v.prototype.delete=function(e){var t=h(e),n=t in this._store;return delete this._store[t],n},v.prototype.forEach=function(e){for(var t=Object.keys(this._store),n=0,r=t.length;n<r;n++){var o=t[n];e(this._store[o],o=p(o))}},Object.defineProperty(v.prototype,"size",{get:function(){return Object.keys(this._store).length}}),y.prototype.add=function(e){return this._store.set(e,!0)},y.prototype.has=function(e){return this._store.has(e)},y.prototype.forEach=function(e){this._store.forEach((function(t,n){e(n)}))},Object.defineProperty(y.prototype,"size",{get:function(){return this._store.size}}),
/* global Map,Set,Symbol */
// Based on https://kangax.github.io/compat-table/es6/ we can sniff out
// incomplete Map/Set implementations which would otherwise cause our tests to fail.
// Notably they fail in IE11 and iOS 8.4, which this prevents.
function(){if("undefined"==typeof Symbol||"undefined"==typeof Map||"undefined"==typeof Set)return!1;var e=Object.getOwnPropertyDescriptor(Map,Symbol.species);return e&&"get"in e&&Map[Symbol.species]===Map}
// based on https://github.com/montagejs/collections
()?(// prefer built-in Map/Set
o=Set,i=Map):(// fall back to our polyfill
o=y,i=v);var g,_,m=Function.prototype.toString,b=m.call(Object);function w(e){var t,n,r;if(!e||"object"!=typeof e)return e;if(Array.isArray(e)){for(t=[],n=0,r=e.length;n<r;n++)t[n]=w(e[n]);return t}
// special case: to avoid inconsistencies between IndexedDB
// and other backends, we automatically stringify Dates
if(e instanceof Date)return e.toISOString();if(function(e){return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer||"undefined"!=typeof Blob&&e instanceof Blob}(e))return function(e){if(e instanceof ArrayBuffer)return function(e){if("function"==typeof e.slice)return e.slice(0);
// IE10-11 slice() polyfill
var t=new ArrayBuffer(e.byteLength),n=new Uint8Array(t),r=new Uint8Array(e);return n.set(r),t}(e);var t=e.size,n=e.type;
// Blob
return"function"==typeof e.slice?e.slice(0,t,n):e.webkitSlice(0,t,n);
// PhantomJS slice() replacement
}(e);if(!function(e){var t=Object.getPrototypeOf(e);
/* istanbul ignore if */if(null===t)// not sure when this happens, but I guess it can
return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&m.call(n)==b}(e))return e;// don't clone objects like Workers
for(n in t={},e)
/* istanbul ignore else */
if(Object.prototype.hasOwnProperty.call(e,n)){var o=w(e[n]);void 0!==o&&(t[n]=o)}return t}function k(e){var t=!1;return f((function(n){
/* istanbul ignore if */
if(t)
// this is a smoke test and should never actually happen
throw new Error("once called more than once");t=!0,e.apply(this,n)}))}function j(e){
//create the function we will be returning
return f((function(t){
// Clone arguments
t=w(t);var n=this,r="function"==typeof t[t.length-1]&&t.pop(),o=new Promise((function(r,o){var i;try{var s=k((function(e,t){e?o(e):r(t)}));
// create a callback for this invocation
// apply the function in the orig context
t.push(s),(i=e.apply(n,t))&&"function"==typeof i.then&&r(i)}catch(e){o(e)}}));
// if the last argument is a function, assume its a callback
// if there is a callback, call it back
return r&&o.then((function(e){r(null,e)}),r),o}))}function O(e,t){return j(f((function(n){if(this._closed)return Promise.reject(new Error("database is closed"));if(this._destroyed)return Promise.reject(new Error("database is destroyed"));var r=this;return function(e,t,n){
/* istanbul ignore if */
if(e.constructor.listeners("debug").length){for(var r=["api",e.name,t],o=0;o<n.length-1;o++)r.push(n[o]);e.constructor.emit("debug",r);
// override the callback itself to log the response
var i=n[n.length-1];n[n.length-1]=function(n,r){var o=["api",e.name,t];o=o.concat(n?["error",n]:["success",r]),e.constructor.emit("debug",o),i(n,r)}}}(r,e,n),this.taskqueue.isReady?t.apply(this,n):new Promise((function(t,o){r.taskqueue.addTask((function(i){i?o(i):t(r[e].apply(r,n))}))}))})))}
// like underscore/lodash _.pick()
function A(e,t){for(var n={},r=0,o=t.length;r<o;r++){var i=t[r];i in e&&(n[i]=e[i])}return n}
// Most browsers throttle concurrent requests at 6, so it's silly
// to shim _bulk_get by trying to launch potentially hundreds of requests
// and then letting the majority time out. We can handle this ourselves.
function q(e){return e}function S(e){return[{ok:e}]}
// shim for P/CouchDB adapters that don't directly implement _bulk_get
function x(e,t,n){var r=t.docs,o=new i;
// consolidate into one request per doc if possible
r.forEach((function(e){o.has(e.id)?o.get(e.id).push(e):o.set(e.id,[e])}));var s=o.size,a=0,u=new Array(s);function c(){var e;++a===s&&(e=[],u.forEach((function(t){t.docs.forEach((function(n){e.push({id:t.id,docs:[n]})}))})),n(null,{results:e}))}var f=[];o.forEach((function(e,t){f.push(t)}));var l=0;!function n(){if(!(l>=f.length)){var r=Math.min(l+6,f.length),i=f.slice(l,r);!function(r,i){r.forEach((function(r,s){var a=i+s,f=o.get(r),l=A(f[0],["atts_since","attachments"]);l.open_revs=f.map((function(e){
// rev is optional, open_revs disallowed
return e.rev})),
// remove falsey / undefined revisions
l.open_revs=l.open_revs.filter(q);var d=q;0===l.open_revs.length&&(delete l.open_revs,
// when fetching only the "winning" leaf,
// transform the result so it looks like an open_revs
// request
d=S),
// globally-supplied options
["revs","attachments","binary","ajax","latest"].forEach((function(e){e in t&&(l[e]=t[e])})),e.get(r,l,(function(e,t){var o,i,s;
/* istanbul ignore if */o=e?[{error:e}]:d(t),i=r,s=o,u[a]={id:i,docs:s},c(),n()}))}))}(i,l),l+=i.length}}()}try{localStorage.setItem("_pouch_check_localstorage",1),g=!!localStorage.getItem("_pouch_check_localstorage")}catch(e){g=!1}function E(){return g}
// Custom nextTick() shim for browsers. In node, this will just be process.nextTick(). We
function C(){d.call(this),this._listeners={},
/* istanbul ignore next */
function(e){E()&&addEventListener("storage",(function(t){e.emit(t.key)}))}(this)}function P(e){
/* istanbul ignore else */
if("undefined"!=typeof console&&"function"==typeof console[e]){var t=Array.prototype.slice.call(arguments,1);console[e].apply(console,t)}}function L(e){var t=0;return e||(t=2e3),function(e,t){var n=6e5;// Hard-coded default of 10 minutes
return e=parseInt(e,10)||0,(t=parseInt(t,10))!=t||t<=e?t=(e||1)<<1:t+=1,
// In order to not exceed maxTimeout, pick a random value between half of maxTimeout and maxTimeout
t>n&&(e=3e5,// divide by two
t=n),~~((t-e)*Math.random()+e);// ~~ coerces to an int, but fast.
}(e,t)}
// designed to give info to browser users, who are disturbed
// when they see http errors in the console
function D(e,t){P("info","The above "+e+" is totally normal. "+t)}l(C,d),C.prototype.addListener=function(e,t,n,r){
/* istanbul ignore if */
if(!this._listeners[t]){var o=this,i=!1;this._listeners[t]=a,this.on(e,a)}function a(){
/* istanbul ignore if */
if(o._listeners[t])if(i)i="waiting";else{i=!0;var e=A(r,["style","include_docs","attachments","conflicts","filter","doc_ids","view","since","query_params","binary","return_docs"]);
/* istanbul ignore next */n.changes(e).on("change",(function(e){e.seq>r.since&&!r.cancelled&&(r.since=e.seq,r.onChange(e))})).on("complete",(function(){"waiting"===i&&s(a),i=!1})).on("error",(function(){i=!1}))}}},C.prototype.removeListener=function(e,t){
/* istanbul ignore if */
t in this._listeners&&(d.prototype.removeListener.call(this,e,this._listeners[t]),delete this._listeners[t])},
/* istanbul ignore next */
C.prototype.notifyLocalWindows=function(e){
//do a useless change on a storage thing
//in order to get other windows's listeners to activate
E()&&(localStorage[e]="a"===localStorage[e]?"b":"a")},C.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)},_="function"==typeof Object.assign?Object.assign:function(e){for(var t=Object(e),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)// Skip over if undefined or null
for(var o in r)
// Avoid bugs when hasOwnProperty is shadowed
Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t};var $=_;function I(e,t,n){Error.call(this,n),this.status=e,this.name=t,this.message=n,this.error=!0}l(I,Error),I.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message,reason:this.reason})},new I(401,"unauthorized","Name or password is incorrect.");var T=new I(400,"bad_request","Missing JSON list of 'docs'"),B=new I(404,"not_found","missing"),M=new I(409,"conflict","Document update conflict"),R=new I(400,"bad_request","_id field must contain a string"),U=new I(412,"missing_id","_id is required for puts"),N=new I(400,"bad_request","Only reserved document ids may start with underscore."),F=(new I(412,"precondition_failed","Database not open"),new I(500,"unknown_error","Database encountered an unknown error")),K=new I(500,"badarg","Some query argument is invalid"),J=(new I(400,"invalid_request","Request was invalid"),new I(400,"query_parse_error","Some query parameter is invalid")),z=new I(500,"doc_validation","Bad special document member"),V=new I(400,"bad_request","Something wrong with the request"),G=new I(400,"bad_request","Document must be a JSON object"),Q=(new I(404,"not_found","Database not found"),new I(500,"indexed_db_went_bad","unknown")),W=(new I(500,"web_sql_went_bad","unknown"),new I(500,"levelDB_went_went_bad","unknown"),new I(403,"forbidden","Forbidden by design doc validate_doc_update function"),new I(400,"bad_request","Invalid rev format")),Y=(new I(412,"file_exists","The database could not be created, the file already exists."),new I(412,"missing_stub","A pre-existing attachment stub wasn't found"));function H(e,t){function n(t){for(
// inherit error properties from our parent error manually
// so as to allow proper JSON parsing.
/* jshint ignore:start */
var n=Object.getOwnPropertyNames(e),r=0,o=n.length;r<o;r++)"function"!=typeof e[n[r]]&&(this[n[r]]=e[n[r]]);
/* jshint ignore:end */void 0!==t&&(this.reason=t)}return n.prototype=I.prototype,new n(t)}function X(e){if("object"!=typeof e){var t=e;(e=F).data=t}return"error"in e&&"conflict"===e.error&&(e.name="conflict",e.status=409),"name"in e||(e.name=e.error||"unknown"),"status"in e||(e.status=500),"message"in e||(e.message=e.message||e.reason),e}function Z(e){var t={},n=e.filter&&"function"==typeof e.filter;return t.query=e.query_params,function(r){r.doc||(
// CSG sends events on the changes feed that don't have documents,
// this hack makes a whole lot of existing code robust.
r.doc={});var o=n&&function(e,t,n){try{return!e(t,n)}catch(e){var r="Filter function threw: "+e.toString();return H(V,r)}}(e.filter,r.doc,t);if("object"==typeof o)return o;if(o)return!1;if(e.include_docs){if(!e.attachments)for(var i in r.doc._attachments)
/* istanbul ignore else */
r.doc._attachments.hasOwnProperty(i)&&(r.doc._attachments[i].stub=!0)}else delete r.doc;return!0}}function ee(e){for(var t=[],n=0,r=e.length;n<r;n++)t=t.concat(e[n]);return t}
// shim for Function.prototype.name,
// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or
//     '_local'
//   - any other string value is a valid id
// Returns the specific error object for each case
function te(e){var t;if(e?"string"!=typeof e?t=H(R):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=H(N)):t=H(U),t)throw t}
// Checks if a PouchDB object is "remote" or not. This is
function ne(e){return"boolean"==typeof e._remote?e._remote:
/* istanbul ignore next */
"function"==typeof e.type&&(P("warn","db.type() is deprecated and will be removed in a future version of PouchDB"),"http"===e.type()
/* istanbul ignore next */)}function re(e){if(!e)return null;var t=e.split("/");return 2===t.length?t:1===t.length?[e,e]:null}function oe(e){var t=re(e);return t?t.join("/"):null}
// originally parseUri 1.2.2, now patched by us
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
new I(413,"invalid_url","Provided URL is invalid");var ie=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],se="queryKey",ae=/(?:^|&)([^&=]*)=?([^&]*)/g,ue=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;function ce(e){for(var t=ue.exec(e),n={},r=14;r--;){var o=ie[r],i=t[r]||"",s=-1!==["user","password"].indexOf(o);n[o]=s?decodeURIComponent(i):i}return n[se]={},n[ie[12]].replace(ae,(function(e,t,r){t&&(n[se][t]=r)})),n}
// Based on https://github.com/alexdavid/scope-eval v0.0.3
// (source: https://unpkg.com/scope-eval@0.0.3/scope_eval.js)
// This is basically just a wrapper around new Function()
function fe(e,t){var n=[],r=[];for(var o in t)t.hasOwnProperty(o)&&(n.push(o),r.push(t[o]));return n.push(e),Function.apply(null,n).apply(null,r)}
// this is essentially the "update sugar" function from daleharvey/pouchdb#1388
// the diffFun tells us what delta to apply to the doc.  it either returns
// the doc, or false if it doesn't need to do an update after all
function le(e,t,n){return new Promise((function(r,o){e.get(t,(function(i,s){if(i){
/* istanbul ignore next */
if(404!==i.status)return o(i);s={}}
// the user might change the _rev, so save it for posterity
var a=s._rev,u=n(s);if(!u)
// if the diffFun returns falsy, we short-circuit as
// an optimization
return r({updated:!1,rev:a});
// users aren't allowed to modify these values,
// so reset them here
u._id=t,u._rev=a,r(function(e,t,n){return e.put(t).then((function(e){return{updated:!0,rev:e.rev}}),(function(r){
/* istanbul ignore next */
if(409!==r.status)throw r;return le(e,t._id,n)}))}(e,u,n))}))}))}var de=function(e){return atob(e)},he=function(e){return btoa(e)};
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor (e.g.
// old QtWebKit versions, Android < 4.4).
function pe(e,t){
/* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
e=e||[],t=t||{};try{return new Blob(e,t)}catch(o){if("TypeError"!==o.name)throw o;for(var n=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)n.append(e[r]);return n.getBlob(t.type)}}
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function ve(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),o=0;o<t;o++)r[o]=e.charCodeAt(o);return n}function ye(e,t){return pe([ve(e)],{type:t})}function ge(e,t){return ye(de(e),t)}
//Can't find original post, but this is close
//http://stackoverflow.com/questions/6965107/ (continues on next line)
//converting-between-strings-and-arraybuffers
// shim for browsers that don't support it
function _e(e,t){var n=new FileReader,r="function"==typeof n.readAsBinaryString;n.onloadend=function(e){var n=e.target.result||"";if(r)return t(n);t(function(e){for(var t="",n=new Uint8Array(e),r=n.byteLength,o=0;o<r;o++)t+=String.fromCharCode(n[o]);return t}(n))},r?n.readAsBinaryString(e):n.readAsArrayBuffer(e)}function me(e,t){_e(e,(function(e){t(e)}))}function be(e,t){me(e,(function(e){t(he(e))}))}
// simplified API. universal browser support is assumed
// this is not used in the browser
var we=self.setImmediate||self.setTimeout;function ke(e,t,n,r,o){(n>0||r<t.size)&&(
// only slice blob if we really need to
t=function(e,t,n){return e.webkitSlice?e.webkitSlice(t,n):e.slice(t,n)}(t,n,r)),function(e,t){var n=new FileReader;n.onloadend=function(e){var n=e.target.result||new ArrayBuffer(0);t(n)},n.readAsArrayBuffer(e)}(t,(function(t){e.append(t),o()}))}function je(e,t,n,r,o){(n>0||r<t.length)&&(
// only create a substring if we really need to
t=t.substring(n,r)),e.appendBinary(t),o()}function Oe(e,t){var n="string"==typeof e,r=n?e.length:e.size,o=Math.min(32768,r),i=Math.ceil(r/o),s=0,a=n?new u:new u.ArrayBuffer,c=n?je:ke;function f(){we(d)}function l(){var e=function(e){return he(e)}(a.end(!0));t(e),a.destroy()}function d(){var t=s*o;s++,c(a,e,t,t+o,s<i?f:l)}d()}function Ae(e){return u.hash(e)}function qe(e,t){var n=w(e);return t?(delete n._rev_tree,Ae(JSON.stringify(n))):a.v4().replace(/-/g,"").toLowerCase()}var Se=a.v4;// mimic old import, only v4 is ever used elsewhere
// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
function xe(e){for(var t,n,r,o,i=e.rev_tree.slice();o=i.pop();){var s=o.ids,a=s[2],u=o.pos;if(a.length)// non-leaf
for(var c=0,f=a.length;c<f;c++)i.push({pos:u+1,ids:a[c]});else{var l=!!s[1].deleted,d=s[0];
// sort by deleted, then pos, then id
t&&!(r!==l?r:n!==u?n<u:t<d)||(t=d,n=u,r=l)}}return n+"-"+t}
// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
function Ee(e,t){for(var n,r=e.slice();n=r.pop();)for(var o=n.pos,i=n.ids,s=i[2],a=t(0===s.length,o,i[0],n.ctx,i[1]),u=0,c=s.length;u<c;u++)r.push({pos:o+1,ids:s[u],ctx:a})}function Ce(e,t){return e.pos-t.pos}function Pe(e){var t=[];Ee(e,(function(e,n,r,o,i){e&&t.push({rev:n+"-"+r,pos:n,opts:i})})),t.sort(Ce).reverse();for(var n=0,r=t.length;n<r;n++)delete t[n].pos;return t}
// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
function Le(e){for(var t=xe(e),n=Pe(e.rev_tree),r=[],o=0,i=n.length;o<i;o++){var s=n[o];s.rev===t||s.opts.deleted||r.push(s.rev)}return r}
// compact a tree by marking its non-leafs as missing,
// and return a list of revs to delete
// build up a list of all the paths to the leafs in this revision tree
function De(e){for(var t,n=[],r=e.slice();t=r.pop();){var o=t.pos,i=t.ids,s=i[0],a=i[1],u=i[2],c=0===u.length,f=t.history?t.history.slice():[];f.push({id:s,opts:a}),c&&n.push({pos:o+1-f.length,ids:f});for(var l=0,d=u.length;l<d;l++)r.push({pos:o+1,ids:u[l],history:f})}return n.reverse()}
// for a better overview of what this is doing, read:
function $e(e,t){return e.pos-t.pos}
// classic binary search
// assuming the arr is sorted, insert the item in the proper place
function Ie(e,t,n){var r=function(e,t,n){for(var r,o=0,i=e.length;o<i;)n(e[r=o+i>>>1],t)<0?o=r+1:i=r;return o}(e,t,n);e.splice(r,0,t)}
// Turn a path as a flat array into a tree with a single branch.
// If any should be stemmed from the beginning of the array, that's passed
// in as the second argument
function Te(e,t){for(var n,r,o=t,i=e.length;o<i;o++){var s=e[o],a=[s.id,s.opts,[]];r?(r[2].push(a),r=a):n=r=a}return n}
// compare the IDs of two trees
function Be(e,t){return e[0]<t[0]?-1:1}
// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function Me(e,t){for(var n=[{tree1:e,tree2:t}],r=!1;n.length>0;){var o=n.pop(),i=o.tree1,s=o.tree2;(i[1].status||s[1].status)&&(i[1].status="available"===i[1].status||"available"===s[1].status?"available":"missing");for(var a=0;a<s[2].length;a++)if(i[2][0]){for(var u=!1,c=0;c<i[2].length;c++)i[2][c][0]===s[2][a][0]&&(n.push({tree1:i[2][c],tree2:s[2][a]}),u=!0);u||(r="new_branch",Ie(i[2],s[2][a],Be))}else r="new_leaf",i[2][0]=s[2][a]}return{conflicts:r,tree:e}}function Re(e,t,n){var r,o=[],i=!1,s=!1;if(!e.length)return{tree:[t],conflicts:"new_leaf"};for(var a=0,u=e.length;a<u;a++){var c=e[a];if(c.pos===t.pos&&c.ids[0]===t.ids[0])
// Paths start at the same position and have the same root, so they need
// merged
r=Me(c.ids,t.ids),o.push({pos:c.pos,ids:r.tree}),i=i||r.conflicts,s=!0;else if(!0!==n){
// The paths start at a different position, take the earliest path and
// traverse up until it as at the same point from root as the path we
// want to merge.  If the keys match we return the longer path with the
// other merged After stemming we dont want to expand the trees
var f=c.pos<t.pos?c:t,l=c.pos<t.pos?t:c,d=l.pos-f.pos,h=[],p=[];for(p.push({ids:f.ids,diff:d,parent:null,parentIdx:null});p.length>0;){var v=p.pop();if(0!==v.diff)for(var y=v.ids[2],g=0,_=y.length;g<_;g++)p.push({ids:y[g],diff:v.diff-1,parent:v.ids,parentIdx:g});else v.ids[0]===l.ids[0]&&h.push(v)}var m=h[0];m?(r=Me(m.ids,l.ids),m.parent[2][m.parentIdx]=r.tree,o.push({pos:f.pos,ids:f.ids}),i=i||r.conflicts,s=!0):o.push(c)}else o.push(c)}
// We didnt find
return s||o.push(t),o.sort($e),{tree:o,conflicts:i||"internal_node"}}
// To ensure we dont grow the revision tree infinitely, we stem old revisions
function Ue(e,t,n){var r=Re(e,t),o=function(e,t){for(
// First we break out the tree into a complete list of root to leaf paths
var n,r,o=De(e),i=0,s=o.length;i<s;i++){
// Then for each path, we cut off the start of the path based on the
// `depth` to stem to, and generate a new set of flat trees
var a,u=o[i],c=u.ids;if(c.length>t){
// only do the stemming work if we actually need to stem
n||(n={});var f=c.length-t;a={pos:u.pos+f,ids:Te(c,f)};for(var l=0;l<f;l++){var d=u.pos+l+"-"+c[l].id;n[d]=!0}}else// no need to actually stem
a={pos:u.pos,ids:Te(c,0)};
// Then we remerge all those flat trees together, ensuring that we dont
// connect trees that would go beyond the depth limit
r=r?Re(r,a,!0).tree:[a]}
// this is memory-heavy per Chrome profiler, avoid unless we actually stemmed
return n&&Ee(r,(function(e,t,r){
// some revisions may have been removed in a branch but not in another
delete n[t+"-"+r]})),{tree:r,revs:n?Object.keys(n):[]}}(r.tree,n);return{tree:o.tree,stemmedRevs:o.revs,conflicts:r.conflicts}}
// return true if a rev exists in the rev tree, false otherwise
function Ne(e){return e.ids}
// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
function Fe(e,t){t||(t=xe(e));for(var n,r=t.substring(t.indexOf("-")+1),o=e.rev_tree.map(Ne);n=o.pop();){if(n[0]===r)return!!n[1].deleted;o=o.concat(n[2])}}function Ke(e){return/^_local/.test(e)}
// returns the current leaf node for a given revision
function Je(e,t,n){d.call(this);var r=this;this.db=e;var o=(t=t?w(t):{}).complete=k((function(t,n){var o,s;t?(s="error",("listenerCount"in(o=r)?o.listenerCount(s):d.listenerCount(o,s))>0&&r.emit("error",t)):r.emit("complete",n),r.removeAllListeners(),e.removeListener("destroyed",i)}));function i(){r.cancel()}n&&(r.on("complete",(function(e){n(null,e)})),r.on("error",n)),e.once("destroyed",i),t.onChange=function(e,t,n){
/* istanbul ignore if */
r.isCancelled||function(e,t,n,r){
// isolate try/catches to avoid V8 deoptimizations
try{e.emit("change",t,n,r)}catch(e){P("error",'Error in .on("change", function):',e)}}(r,e,t,n)};var s=new Promise((function(e,n){t.complete=function(t,r){t?n(t):e(r)}}));r.once("cancel",(function(){e.removeListener("destroyed",i),t.complete(null,{status:"cancelled"})})),this.then=s.then.bind(s),this.catch=s.catch.bind(s),this.then((function(e){o(null,e)}),o),e.taskqueue.isReady?r.validateChanges(t):e.taskqueue.addTask((function(e){e?t.complete(e):r.isCancelled?r.emit("cancel"):r.validateChanges(t)}))}function ze(e,t,n){var r=[{rev:e._rev}];"all_docs"===n.style&&(r=Pe(t.rev_tree).map((function(e){return{rev:e.rev}})));var o={id:t.id,changes:r,doc:e};return Fe(t,e._rev)&&(o.deleted=!0),n.conflicts&&(o.doc._conflicts=Le(t),o.doc._conflicts.length||delete o.doc._conflicts),o}
/*
 * A generic pouch adapter
 */function Ve(e,t){return e<t?-1:e>t?1:0}
// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function Ge(e,t){return function(n,r){n||r[0]&&r[0].error?((n=n||r[0]).docId=t,e(n)):e(null,r.length?r[0]:r)}}
// clean docs given to us by the user
// compare two docs, first by _id then by _rev
function Qe(e,t){var n=Ve(e._id,t._id);return 0!==n?n:Ve(e._revisions?e._revisions.start:0,t._revisions?t._revisions.start:0)}
// for every node in a revision tree computes its distance from the closest
// leaf
// all compaction is done in a queue, to avoid attaching
// too many listeners at once
function We(e){var t=e._compactionQueue[0],n=t.opts,r=t.callback;e.get("_local/compaction").catch((function(){return!1})).then((function(t){t&&t.last_seq&&(n.last_seq=t.last_seq),e._compact(n,(function(t,n){
/* istanbul ignore if */
t?r(t):r(null,n),s((function(){e._compactionQueue.shift(),e._compactionQueue.length&&We(e)}))}))}))}function Ye(){
// re-bind prototyped methods
for(var e in d.call(this),Ye.prototype)"function"==typeof this[e]&&(this[e]=this[e].bind(this))}function He(){this.isReady=!1,this.failed=!1,this.queue=[]}function Xe(e,t){
// In Node our test suite only tests this for PouchAlt unfortunately
/* istanbul ignore if */
if(!(this instanceof Xe))return new Xe(e,t);var n=this;if(t=t||{},e&&"object"==typeof e&&(e=(t=e).name,delete t.name),void 0===t.deterministic_revs&&(t.deterministic_revs=!0),this.__opts=t=w(t),n.auto_compaction=t.auto_compaction,n.prefix=Xe.prefix,"string"!=typeof e)throw new Error("Missing/invalid DB name");var r=function(e,t){var n=e.match(/([a-z-]*):\/\/(.*)/);if(n)
// the http adapter expects the fully qualified name
return{name:/https?/.test(n[1])?n[1]+"://"+n[2]:n[2],adapter:n[1]};var r=Xe.adapters,o=Xe.preferredAdapters,i=Xe.prefix,s=t.adapter;if(!s)// automatically determine adapter
for(var a=0;a<o.length&&"idb"===(s=o[a])&&"websql"in r&&E()&&localStorage["_pouch__websqldb_"+i+e];++a)
// log it, because this can be confusing during development
P("log",'PouchDB is downgrading "'+e+'" to WebSQL to avoid data loss, because it was already opened with WebSQL.');var u=r[s];
// if adapter is invalid, then an error will be thrown later
return{name:u&&"use_prefix"in u&&!u.use_prefix?e:i+e,adapter:s}}
// OK, so here's the deal. Consider this code:
//     var db1 = new PouchDB('foo');
//     var db2 = new PouchDB('foo');
//     db1.destroy();
// ^ these two both need to emit 'destroyed' events,
// as well as the PouchDB constructor itself.
// So we have one db object (whichever one got destroy() called on it)
// responsible for emitting the initial event, which then gets emitted
// by the constructor, which then broadcasts it to any other dbs
// that may have been created with the same name.
((t.prefix||"")+e,t);if(t.name=r.name,t.adapter=t.adapter||r.adapter,n.name=e,n._adapter=t.adapter,Xe.emit("debug",["adapter","Picked adapter: ",t.adapter]),!Xe.adapters[t.adapter]||!Xe.adapters[t.adapter].valid())throw new Error("Invalid Adapter: "+t.adapter);Ye.call(n),n.taskqueue=new He,n.adapter=t.adapter,Xe.adapters[t.adapter].call(n,t,(function(e){if(e)return n.taskqueue.fail(e);!function(e){function t(t){e.removeListener("closed",n),t||e.constructor.emit("destroyed",e.name)}function n(){e.removeListener("destroyed",t),e.constructor.emit("unref",e)}e.once("destroyed",t),e.once("closed",n),e.constructor.emit("ref",e)}(n),n.emit("created",n),Xe.emit("created",n.name),n.taskqueue.ready(n)}))}
// AbortController was introduced quite a while after fetch and
// isnt required for PouchDB to function so polyfill if needed
l(Je,d),Je.prototype.cancel=function(){this.isCancelled=!0,this.db.taskqueue.isReady&&this.emit("cancel")},Je.prototype.validateChanges=function(e){var t=e.complete,n=this;
/* istanbul ignore else */Xe._changesFilterPlugin?Xe._changesFilterPlugin.validate(e,(function(r){if(r)return t(r);n.doChanges(e)})):n.doChanges(e)},Je.prototype.doChanges=function(e){var t=this,n=e.complete;if("live"in(e=w(e))&&!("continuous"in e)&&(e.continuous=e.live),e.processChange=ze,"latest"===e.since&&(e.since="now"),e.since||(e.since=0),"now"!==e.since
/* istanbul ignore else */){if(Xe._changesFilterPlugin){if(Xe._changesFilterPlugin.normalize(e),Xe._changesFilterPlugin.shouldFilter(this,e))return Xe._changesFilterPlugin.filter(this,e)}else["doc_ids","filter","selector","view"].forEach((function(t){t in e&&P("warn",'The "'+t+'" option was passed in to changes/replicate, but pouchdb-changes-filter plugin is not installed, so it was ignored. Please install the plugin to enable filtering.')}));"descending"in e||(e.descending=!1),
// 0 and 1 should return 1 document
e.limit=0===e.limit?1:e.limit,e.complete=n;var r=this.db._changes(e);
/* istanbul ignore else */if(r&&"function"==typeof r.cancel){var o=t.cancel;t.cancel=f((function(e){r.cancel(),o.apply(this,e)}))}}else this.db.info().then((function(r){
/* istanbul ignore if */
t.isCancelled?n(null,{status:"cancelled"}):(e.since=r.update_seq,t.doChanges(e))}),n)},l(Ye,d),Ye.prototype.post=O("post",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(H(G));this.bulkDocs({docs:[e]},t,Ge(n,e._id))})),Ye.prototype.put=O("put",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(H(G));if(te(e._id),Ke(e._id)&&"function"==typeof this._putLocal)return e._deleted?this._removeLocal(e,n):this._putLocal(e,n);var r,o,i,s,a=this;function u(n){"function"==typeof a._put&&!1!==t.new_edits?a._put(e,t,n):a.bulkDocs({docs:[e]},t,Ge(n,e._id))}t.force&&e._rev?(o=(r=e._rev.split("-"))[1],i=parseInt(r[0],10)+1,s=qe(),e._revisions={start:i,ids:[s,o]},e._rev=i+"-"+s,t.new_edits=!1,u((function(t){var r=t?null:{ok:!0,id:e._id,rev:e._rev};n(t,r)}))):u(n)})),Ye.prototype.putAttachment=O("putAttachment",(function(e,t,n,r,o){var i=this;function s(e){var n="_rev"in e?parseInt(e._rev,10):0;return e._attachments=e._attachments||{},e._attachments[t]={content_type:o,data:r,revpos:++n},i.put(e)}return"function"==typeof o&&(o=r,r=n,n=null),
// Lets fix in https://github.com/pouchdb/pouchdb/issues/3267
/* istanbul ignore if */
void 0===o&&(o=r,r=n,n=null),o||P("warn","Attachment",t,"on document",e,"is missing content_type"),i.get(e).then((function(e){if(e._rev!==n)throw H(M);return s(e)}),(function(t){
// create new doc
/* istanbul ignore else */
if(t.reason===B.message)return s({_id:e});throw t}))})),Ye.prototype.removeAttachment=O("removeAttachment",(function(e,t,n,r){var o=this;o.get(e,(function(e,i){
/* istanbul ignore if */
if(e)r(e);else if(i._rev===n){
/* istanbul ignore if */
if(!i._attachments)return r();delete i._attachments[t],0===Object.keys(i._attachments).length&&delete i._attachments,o.put(i,r)}else r(H(M))}))})),Ye.prototype.remove=O("remove",(function(e,t,n,r){var o;"string"==typeof t?(
// id, rev, opts, callback style
o={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(
// doc, opts, callback style
o=e,"function"==typeof t?(r=t,n={}):(r=n,n=t)),(n=n||{}).was_delete=!0;var i={_id:o._id,_rev:o._rev||n.rev,_deleted:!0};if(Ke(i._id)&&"function"==typeof this._removeLocal)return this._removeLocal(o,r);this.bulkDocs({docs:[i]},n,Ge(r,i._id))})),Ye.prototype.revsDiff=O("revsDiff",(function(e,t,n){"function"==typeof t&&(n=t,t={});var r=Object.keys(e);if(!r.length)return n(null,{});var o=0,s=new i;function a(e,t){s.has(e)||s.set(e,{missing:[]}),s.get(e).missing.push(t)}r.map((function(t){this._getRevisionTree(t,(function(i,u){if(i&&404===i.status&&"missing"===i.message)s.set(t,{missing:e[t]});else{if(i)
/* istanbul ignore next */
return n(i);!function(t,n){
// Is this fast enough? Maybe we should switch to a set simulated by a map
var r=e[t].slice(0);Ee(n,(function(e,n,o,i,s){var u=n+"-"+o,c=r.indexOf(u);-1!==c&&(r.splice(c,1),
/* istanbul ignore if */
"available"!==s.status&&a(t,u))})),
// Traversing the tree is synchronous, so now `missingForId` contains
// revisions that were not found in the tree
r.forEach((function(e){a(t,e)}))}(t,u)}if(++o===r.length){
// convert LazyMap to object
var c={};return s.forEach((function(e,t){c[t]=e})),n(null,c)}}))}),this)})),
// _bulk_get API for faster replication, as described in
// https://github.com/apache/couchdb-chttpd/pull/33
// At the "abstract" level, it will just run multiple get()s in
// parallel, because this isn't much of a performance cost
// for local databases (except the cost of multiple transactions, which is
// small). The http adapter overrides this in order
// to do a more efficient single HTTP request.
Ye.prototype.bulkGet=O("bulkGet",(function(e,t){x(this,e,t)})),
// compact one document and fire callback
// by compacting we mean removing all revisions which
// are further from the leaf in revision tree than max_height
Ye.prototype.compactDocument=O("compactDocument",(function(e,t,n){var r=this;this._getRevisionTree(e,(function(o,i){
/* istanbul ignore if */
if(o)return n(o);var s=function(e){var t={},n=[];return Ee(e,(function(e,r,o,i){var s=r+"-"+o;return e&&(t[s]=0),void 0!==i&&n.push({from:i,to:s}),s})),n.reverse(),n.forEach((function(e){void 0===t[e.from]?t[e.from]=1+t[e.to]:t[e.from]=Math.min(t[e.from],1+t[e.to])})),t}(i),a=[],u=[];Object.keys(s).forEach((function(e){s[e]>t&&a.push(e)})),Ee(i,(function(e,t,n,r,o){var i=t+"-"+n;"available"===o.status&&-1!==a.indexOf(i)&&u.push(i)})),r._doCompaction(e,u,n)}))})),
// compact the whole database using single document
// compaction
Ye.prototype.compact=O("compact",(function(e,t){"function"==typeof e&&(t=e,e={});var n=this;e=e||{},n._compactionQueue=n._compactionQueue||[],n._compactionQueue.push({opts:e,callback:t}),1===n._compactionQueue.length&&We(n)})),Ye.prototype._compact=function(e,t){var n=this,r={return_docs:!1,last_seq:e.last_seq||0},o=[];n.changes(r).on("change",(function(e){o.push(n.compactDocument(e.id,0))})).on("complete",(function(e){var r=e.last_seq;Promise.all(o).then((function(){return le(n,"_local/compaction",(function(e){return(!e.last_seq||e.last_seq<r)&&(e.last_seq=r,e)}))})).then((function(){t(null,{ok:!0})})).catch(t)})).on("error",t)},
/* Begin api wrappers. Specific functionality to storage belongs in the
   _[method] */
Ye.prototype.get=O("get",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"string"!=typeof e)return n(H(R));if(Ke(e)&&"function"==typeof this._getLocal)return this._getLocal(e,n);var r=[],o=this;function i(){var i=[],s=r.length;
/* istanbul ignore if */if(!s)return n(null,i);
// order with open_revs is unspecified
r.forEach((function(r){o.get(e,{rev:r,revs:t.revs,latest:t.latest,attachments:t.attachments,binary:t.binary},(function(e,t){if(e)i.push({missing:r});else{for(
// using latest=true can produce duplicates
var o,a=0,u=i.length;a<u;a++)if(i[a].ok&&i[a].ok._rev===t._rev){o=!0;break}o||i.push({ok:t})}--s||n(null,i)}))}))}if(!t.open_revs)return this._get(e,t,(function(r,i){if(r)return r.docId=e,n(r);var s=i.doc,a=i.metadata,u=i.ctx;if(t.conflicts){var c=Le(a);c.length&&(s._conflicts=c)}if(Fe(a,s._rev)&&(s._deleted=!0),t.revs||t.revs_info){for(var f=s._rev.split("-"),l=parseInt(f[0],10),d=f[1],h=De(a.rev_tree),p=null,v=0;v<h.length;v++){var y=h[v],g=y.ids.map((function(e){return e.id})).indexOf(d);(g===l-1||!p&&-1!==g)&&(p=y)}
/* istanbul ignore if */if(!p)return(r=new Error("invalid rev tree")).docId=e,n(r);var _=p.ids.map((function(e){return e.id})).indexOf(s._rev.split("-")[1])+1,m=p.ids.length-_;if(p.ids.splice(_,m),p.ids.reverse(),t.revs&&(s._revisions={start:p.pos+p.ids.length-1,ids:p.ids.map((function(e){return e.id}))}),t.revs_info){var b=p.pos+p.ids.length;s._revs_info=p.ids.map((function(e){return{rev:--b+"-"+e.id,status:e.opts.status}}))}}if(t.attachments&&s._attachments){var w=s._attachments,k=Object.keys(w).length;if(0===k)return n(null,s);Object.keys(w).forEach((function(e){this._getAttachment(s._id,e,w[e],{
// Previously the revision handling was done in adapter.js
// getAttachment, however since idb-next doesnt we need to
// pass the rev through
rev:s._rev,binary:t.binary,ctx:u},(function(t,r){var o=s._attachments[e];o.data=r,delete o.stub,delete o.length,--k||n(null,s)}))}),o)}else{if(s._attachments)for(var j in s._attachments)
/* istanbul ignore else */
s._attachments.hasOwnProperty(j)&&(s._attachments[j].stub=!0);n(null,s)}}));if("all"===t.open_revs)this._getRevisionTree(e,(function(e,t){
/* istanbul ignore if */
if(e)return n(e);r=Pe(t).map((function(e){return e.rev})),i()}));else{if(!Array.isArray(t.open_revs))return n(H(F,"function_clause"));r=t.open_revs;for(var s=0;s<r.length;s++){var a=r[s];
// looks like it's the only thing couchdb checks
if("string"!=typeof a||!/^\d+-/.test(a))return n(H(W))}i()}})),
// TODO: I dont like this, it forces an extra read for every
// attachment read and enforces a confusing api between
// adapter.js and the adapter implementation
Ye.prototype.getAttachment=O("getAttachment",(function(e,t,n,r){var o=this;n instanceof Function&&(r=n,n={}),this._get(e,n,(function(i,s){return i?r(i):s.doc._attachments&&s.doc._attachments[t]?(n.ctx=s.ctx,n.binary=!0,void o._getAttachment(e,t,s.doc._attachments[t],n,r)):r(H(B))}))})),Ye.prototype.allDocs=O("allDocs",(function(e,t){if("function"==typeof e&&(t=e,e={}),e.skip=void 0!==e.skip?e.skip:0,e.start_key&&(e.startkey=e.start_key),e.end_key&&(e.endkey=e.end_key),"keys"in e){if(!Array.isArray(e.keys))return t(new TypeError("options.keys must be an array"));var n=["startkey","endkey","key"].filter((function(t){return t in e}))[0];if(n)return void t(H(J,"Query parameter `"+n+"` is not compatible with multi-get"));if(!ne(this)&&(function(e){var t="limit"in e?e.keys.slice(e.skip,e.limit+e.skip):e.skip>0?e.keys.slice(e.skip):e.keys;e.keys=t,e.skip=0,delete e.limit,e.descending&&(t.reverse(),e.descending=!1)}(e),0===e.keys.length))return this._allDocs({limit:0},t)}return this._allDocs(e,t)})),Ye.prototype.changes=function(e,t){return"function"==typeof e&&(t=e,e={}),
// By default set return_docs to false if the caller has opts.live = true,
// this will prevent us from collecting the set of changes indefinitely
// resulting in growing memory
(e=e||{}).return_docs="return_docs"in e?e.return_docs:!e.live,new Je(this,e,t)},Ye.prototype.close=O("close",(function(e){return this._closed=!0,this.emit("closed"),this._close(e)})),Ye.prototype.info=O("info",(function(e){var t=this;this._info((function(n,r){if(n)return e(n);
// assume we know better than the adapter, unless it informs us
r.db_name=r.db_name||t.name,r.auto_compaction=!(!t.auto_compaction||ne(t)),r.adapter=t.adapter,e(null,r)}))})),Ye.prototype.id=O("id",(function(e){return this._id(e)})),
/* istanbul ignore next */
Ye.prototype.type=function(){return"function"==typeof this._type?this._type():this.adapter},Ye.prototype.bulkDocs=O("bulkDocs",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),t=t||{},Array.isArray(e)&&(e={docs:e}),!e||!e.docs||!Array.isArray(e.docs))return n(H(T));for(var r=0;r<e.docs.length;++r)if("object"!=typeof e.docs[r]||Array.isArray(e.docs[r]))return n(H(G));var o;if(e.docs.forEach((function(e){e._attachments&&Object.keys(e._attachments).forEach((function(t){o=o||function(e){return"_"===e.charAt(0)&&e+" is not a valid attachment name, attachment names cannot start with '_'"}(t),e._attachments[t].content_type||P("warn","Attachment",t,"on document",e._id,"is missing content_type")}))})),o)return n(H(V,o));"new_edits"in t||(t.new_edits=!("new_edits"in e)||e.new_edits);var i=this;t.new_edits||ne(i)||
// ensure revisions of the same doc are sorted, so that
// the local adapter processes them correctly (#2935)
e.docs.sort(Qe),function(e){for(var t=0;t<e.length;t++){var n=e[t];if(n._deleted)delete n._attachments;// ignore atts for deleted docs
else if(n._attachments)for(
// filter out extraneous keys from _attachments
var r=Object.keys(n._attachments),o=0;o<r.length;o++){var i=r[o];n._attachments[i]=A(n._attachments[i],["data","digest","content_type","length","revpos","stub"])}}}(e.docs);
// in the case of conflicts, we want to return the _ids to the user
// however, the underlying adapter may destroy the docs array, so
// create a copy here
var s=e.docs.map((function(e){return e._id}));return this._bulkDocs(e,t,(function(e,r){if(e)return n(e);
// add ids for error/conflict responses (not required for CouchDB)
if(t.new_edits||(
// this is what couch does when new_edits is false
r=r.filter((function(e){return e.error}))),!ne(i))for(var o=0,a=r.length;o<a;o++)r[o].id=r[o].id||s[o];n(null,r)}))})),Ye.prototype.registerDependentDatabase=O("registerDependentDatabase",(function(e,t){var n=new this.constructor(e,this.__opts);le(this,"_local/_pouch_dependentDbs",(function(t){return t.dependentDbs=t.dependentDbs||{},!t.dependentDbs[e]&&(t.dependentDbs[e]=!0,t)})).then((function(){t(null,{db:n})})).catch(t)})),Ye.prototype.destroy=O("destroy",(function(e,t){"function"==typeof e&&(t=e,e={});var n=this,r=!("use_prefix"in n)||n.use_prefix;function o(){
// call destroy method of the particular adaptor
n._destroy(e,(function(e,r){if(e)return t(e);n._destroyed=!0,n.emit("destroyed"),t(null,r||{ok:!0})}))}if(ne(n))
// no need to check for dependent DBs if it's a remote DB
return o();n.get("_local/_pouch_dependentDbs",(function(e,i){if(e)
/* istanbul ignore if */
return 404!==e.status?t(e):o();var s=i.dependentDbs,a=n.constructor,u=Object.keys(s).map((function(e){
// use_prefix is only false in the browser
/* istanbul ignore next */
var t=r?e.replace(new RegExp("^"+a.prefix),""):e;return new a(t,n.__opts).destroy()}));Promise.all(u).then(o,t)}))})),He.prototype.execute=function(){var e;if(this.failed)for(;e=this.queue.shift();)e(this.failed);else for(;e=this.queue.shift();)e()},He.prototype.fail=function(e){this.failed=e,this.execute()},He.prototype.ready=function(e){this.isReady=!0,this.db=e,this.execute()},He.prototype.addTask=function(e){this.queue.push(e),this.failed&&this.execute()},l(Xe,Ye);var Ze="undefined"!=typeof AbortController?AbortController:function(){return{abort:function(){}}},et=fetch,tt=Headers;Xe.adapters={},Xe.preferredAdapters=[],Xe.prefix="_pouch_";var nt=new d;
// this would just be "return doc[field]", but fields
// can be "deep" due to dot notation
function rt(e,t){for(var n=e,r=0,o=t.length;r<o&&(n=n[t[r]]);r++);return n}
// Converts a string in dot notation to an array of its components, with backslash escaping
function ot(e){for(
// fields may be deep (e.g. "foo.bar.baz"), so parse
var t=[],n="",r=0,o=e.length;r<o;r++){var i=e[r];"."===i?r>0&&"\\"===e[r-1]?// escaped delimiter
n=n.substring(0,n.length-1)+".":(// not escaped, so delimiter
t.push(n),n=""):// normal character
n+=i}return t.push(n),t}!function(e){Object.keys(d.prototype).forEach((function(t){"function"==typeof d.prototype[t]&&(e[t]=nt[t].bind(nt))}));
// these are created in constructor.js, and allow us to notify each DB with
// the same name that it was destroyed, via the constructor object
var t=e._destructionListeners=new i;e.on("ref",(function(e){t.has(e.name)||t.set(e.name,[]),t.get(e.name).push(e)})),e.on("unref",(function(e){if(t.has(e.name)){var n=t.get(e.name),r=n.indexOf(e);r<0||(n.splice(r,1),n.length>1?
/* istanbul ignore next */
t.set(e.name,n):t.delete(e.name))}})),e.on("destroyed",(function(e){if(t.has(e)){var n=t.get(e);t.delete(e),n.forEach((function(e){e.emit("destroyed",!0)}))}}))}(Xe),Xe.adapter=function(e,t,n){
/* istanbul ignore else */
t.valid()&&(Xe.adapters[e]=t,n&&Xe.preferredAdapters.push(e))},Xe.plugin=function(e){if("function"==typeof e)// function style for plugins
e(Xe);else{if("object"!=typeof e||0===Object.keys(e).length)throw new Error('Invalid plugin: got "'+e+'", expected an object or a function');Object.keys(e).forEach((function(t){// object style for plugins
Xe.prototype[t]=e[t]}))}return this.__defaults&&(Xe.__defaults=$({},this.__defaults)),Xe},Xe.defaults=function(e){function t(e,n){if(!(this instanceof t))return new t(e,n);n=n||{},e&&"object"==typeof e&&(e=(n=e).name,delete n.name),n=$({},t.__defaults,n),Xe.call(this,e,n)}return l(t,Xe),t.preferredAdapters=Xe.preferredAdapters.slice(),Object.keys(Xe).forEach((function(e){e in t||(t[e]=Xe[e])})),
// make default options transitive
// https://github.com/pouchdb/pouchdb/issues/5922
t.__defaults=$({},this.__defaults,e),t},Xe.fetch=function(e,t){return et(e,t)};var it=["$or","$nor","$not"];function st(e){return it.indexOf(e)>-1}function at(e){return Object.keys(e)[0]}
// flatten an array of selectors joined by an $and operator
function ut(e){
// sort to ensure that e.g. if the user specified
// $and: [{$gt: 'a'}, {$gt: 'b'}], then it's collapsed into
// just {$gt: 'b'}
var t={};return e.forEach((function(e){Object.keys(e).forEach((function(n){var r=e[n];if("object"!=typeof r&&(r={$eq:r}),st(n))t[n]=r instanceof Array?r.map((function(e){return ut([e])})):ut([r]);else{var o=t[n]=t[n]||{};Object.keys(r).forEach((function(e){var t=r[e];return"$gt"===e||"$gte"===e?
// collapse logically equivalent gt/gte values
function(e,t,n){void 0===n.$eq&&(// do nothing
void 0!==n.$gte?"$gte"===e?t>n.$gte&&(// more specificity
n.$gte=t):// operator === '$gt'
t>=n.$gte&&(// more specificity
delete n.$gte,n.$gt=t):void 0!==n.$gt?"$gte"===e?t>n.$gt&&(// more specificity
delete n.$gt,n.$gte=t):// operator === '$gt'
t>n.$gt&&(// more specificity
n.$gt=t):n[e]=t)}
// collapse logically equivalent lt/lte values
(e,t,o):"$lt"===e||"$lte"===e?function(e,t,n){void 0===n.$eq&&(// do nothing
void 0!==n.$lte?"$lte"===e?t<n.$lte&&(// more specificity
n.$lte=t):// operator === '$gt'
t<=n.$lte&&(// more specificity
delete n.$lte,n.$lt=t):void 0!==n.$lt?"$lte"===e?t<n.$lt&&(// more specificity
delete n.$lt,n.$lte=t):// operator === '$gt'
t<n.$lt&&(// more specificity
n.$lt=t):n[e]=t)}
// combine $ne values into one array
(e,t,o):"$ne"===e?function(e,t){"$ne"in t?
// there are many things this could "not" be
t.$ne.push(e):// doesn't exist yet
t.$ne=[e]}
// add $eq into the mix
(t,o):"$eq"===e?function(e,t){
// these all have less specificity than the $eq
// TODO: check for user errors here
delete t.$gt,delete t.$gte,delete t.$lt,delete t.$lte,delete t.$ne,t.$eq=e}
//#7458: execute function mergeAndedSelectors on nested $and
(t,o):void(o[e]=t)}))}}))})),t}function ct(e){for(var t in e){if(Array.isArray(e))for(var n in e)e[n].$and&&(e[n]=ut(e[n].$and));var r=e[t];"object"==typeof r&&ct(r)}return e}
//#7458: determine id $and is present in selector (at any level)
function ft(e,t){for(var n in e){"$and"===n&&(t=!0);var r=e[n];"object"==typeof r&&(t=ft(r,t))}return t}
// normalize the selector
function lt(e){var t=w(e),n=!1;
//#7458: if $and is present in selector (at any level) merge nested $and
ft(t,!1)&&("$and"in(t=ct(t))&&(t=ut(t.$and)),n=!0),["$or","$nor"].forEach((function(e){e in t&&
// message each individual selector
// e.g. {foo: 'bar'} becomes {foo: {$eq: 'bar'}}
t[e].forEach((function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var r=t[n],o=e[r];"object"==typeof o&&null!==o||(e[r]={$eq:o})}}))})),"$not"in t&&(
//This feels a little like forcing, but it will work for now,
//I would like to come back to this and make the merging of selectors a little more generic
t.$not=ut([t.$not]));for(var r=Object.keys(t),o=0;o<r.length;o++){var i=r[o],s=t[i];"object"!=typeof s||null===s?s={$eq:s}:"$ne"in s&&!n&&(
// I put these in an array, since there may be more than one
// but in the "mergeAnded" operation, I already take care of that
s.$ne=[s.$ne]),t[i]=s}return t}// verified by -Number.MIN_VALUE
// set to '_' for easier debugging 
function dt(e,t){if(e===t)return 0;e=ht(e),t=ht(t);var n=gt(e),r=gt(t);if(n-r!=0)return n-r;switch(typeof e){case"number":return e-t;case"boolean":return e<t?-1:1;case"string":return function(e,t){
// See: https://github.com/daleharvey/pouchdb/issues/40
// This is incompatible with the CouchDB implementation, but its the
// best we can do for now
return e===t?0:e>t?1:-1}(e,t)}return Array.isArray(e)?function(e,t){for(var n=Math.min(e.length,t.length),r=0;r<n;r++){var o=dt(e[r],t[r]);if(0!==o)return o}return e.length===t.length?0:e.length>t.length?1:-1}(e,t):function(e,t){for(var n=Object.keys(e),r=Object.keys(t),o=Math.min(n.length,r.length),i=0;i<o;i++){
// First sort the keys
var s=dt(n[i],r[i]);if(0!==s)return s;
// if the keys are equal sort the values
if(0!==(s=dt(e[n[i]],t[r[i]])))return s}return n.length===r.length?0:n.length>r.length?1:-1}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
(e,t)}
// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
function ht(e){switch(typeof e){case"undefined":return null;case"number":return e===1/0||e===-1/0||isNaN(e)?null:e;case"object":var t=e;if(Array.isArray(e)){var n=e.length;e=new Array(n);for(var r=0;r<n;r++)e[r]=ht(t[r]);
/* istanbul ignore next */}else{if(e instanceof Date)return e.toJSON();if(null!==e)for(var o in// generic object
e={},t)if(t.hasOwnProperty(o)){var i=t[o];void 0!==i&&(e[o]=ht(i))}}}return e}
// convert the given key to a string that would be appropriate
// for lexical sorting, e.g. within a database, where the
// sorting is the same given by the collate() function.
function pt(e){return gt(e=ht(e))+""+function(e){if(null!==e)switch(typeof e){case"boolean":return e?1:0;case"number":
// conversion:
// x yyy zz...zz
// x = 0 for negative, 1 for 0, 2 for positive
// y = exponent (for negative numbers negated) moved so that it's >= 0
// z = mantisse
return function(e){if(0===e)return"1";
// convert number to exponential format for easier and
// more succinct string sorting
var t,n,r=e.toExponential().split(/e\+?/),o=parseInt(r[1],10),i=e<0,s=i?"0":"2",a=(n=function(e,t,n){
/* istanbul ignore next */
for(var r="",o=3-e.length;r.length<o;)r+="0";return r}(t=((i?-o:o)- -324).toString()),n+t);s+=""+a;
// then sort by the factor
var u=Math.abs(parseFloat(r[0]));// [1..10)
/* istanbul ignore next */i&&(// for negative reverse ordering
u=10-u);var c=u.toFixed(20);
// strip zeros from the end
return s+""+c.replace(/\.?0+$/,"")}
// create a comparator based on the sort object
(e);case"string":
// We've to be sure that key does not contain \u0000
// Do order-preserving replacements:
// 0 -> 1, 1
// 1 -> 1, 2
// 2 -> 2, 2
/* eslint-disable no-control-regex */
return e.replace(/\u0002/g,"").replace(/\u0001/g,"").replace(/\u0000/g,"");
/* eslint-enable no-control-regex */case"object":var t=Array.isArray(e),n=t?e:Object.keys(e),r=-1,o=n.length,i="";if(t)for(;++r<o;)i+=pt(n[r]);else for(;++r<o;){var s=n[r];i+=pt(s)+pt(e[s])}return i}return""}(e)+"\0"}function vt(e,t){var n,r=t;if("1"===e[t])n=0,t++;else{var o="0"===e[t];t++;var i="",s=e.substring(t,t+3),a=parseInt(s,10)+-324;for(
/* istanbul ignore next */
o&&(a=-a),t+=3;;){var u=e[t];if("\0"===u)break;i+=u,t++}n=1===(i=i.split(".")).length?parseInt(i,10):parseFloat(i[0]+"."+i[1])
/* istanbul ignore next */,o&&(n-=10
/* istanbul ignore next */),0!==a&&(
// parseFloat is more reliable than pow due to rounding errors
// e.g. Number.MAX_VALUE would return Infinity if we did
// num * Math.pow(10, magnitude);
n=parseFloat(n+"e"+a))}return{num:n,length:t-r}}
// move up the stack while parsing
// this function moved outside of parseIndexableString for performance
function yt(e,t){var n=e.pop();if(t.length){var r=t[t.length-1];n===r.element&&(
// popping a meta-element, e.g. an object whose value is another object
t.pop(),r=t[t.length-1]);var o=r.element,i=r.index;Array.isArray(o)?o.push(n):i===e.length-2?o[e.pop()]=n:e.push(n);// obj with key only
}}function gt(e){var t=["boolean","number","string","object"].indexOf(typeof e);
//false if -1 otherwise true, but fast!!!!1
return~t?null===e?1:Array.isArray(e)?5:t<3?t+2:t+3:
/* istanbul ignore next */
Array.isArray(e)?5:void 0}function _t(e,t,n){return n.every((function(n){var r=t[n],o=ot(n),i=rt(e,o);return st(n)?function(e,t,n){return"$or"===e?t.some((function(e){return _t(n,e,Object.keys(e))})):"$not"===e?!_t(n,t,Object.keys(t)):!t.find((function(e){return _t(n,e,Object.keys(e))}))}(n,r,e):mt(r,e,o,i)}))}function mt(e,t,n,r){return!e||(
// is matcher an object, if so continue recursion
"object"==typeof e?Object.keys(e).every((function(o){var i=e[o];return function(e,t,n,r,o){if(!jt[e])throw new Error('unknown operator "'+e+'" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');return jt[e](t,n,r,o)}(o,t,i,n,r)})):e===r)}function bt(e){return null!=e}function wt(e){return void 0!==e}function kt(e,t){return t.some((function(t){return e instanceof Array?e.indexOf(t)>-1:e===t}))}var jt={$elemMatch:function(e,t,n,r){return!!Array.isArray(r)&&0!==r.length&&("object"==typeof r[0]?r.some((function(e){return _t(e,t,Object.keys(t))})):r.some((function(r){return mt(t,e,n,r)})))},$allMatch:function(e,t,n,r){return!!Array.isArray(r)&&
/* istanbul ignore next */
0!==r.length&&("object"==typeof r[0]?r.every((function(e){return _t(e,t,Object.keys(t))})):r.every((function(r){return mt(t,e,n,r)})))},$eq:function(e,t,n,r){return wt(r)&&0===dt(r,t)},$gte:function(e,t,n,r){return wt(r)&&dt(r,t)>=0},$gt:function(e,t,n,r){return wt(r)&&dt(r,t)>0},$lte:function(e,t,n,r){return wt(r)&&dt(r,t)<=0},$lt:function(e,t,n,r){return wt(r)&&dt(r,t)<0},$exists:function(e,t,n,r){
//a field that is null is still considered to exist
return t?wt(r):!wt(r)},$mod:function(e,t,n,r){return bt(r)&&function(e,t){var n=t[0],r=t[1];if(0===n)throw new Error("Bad divisor, cannot divide by zero");if(parseInt(n,10)!==n)throw new Error("Divisor is not an integer");if(parseInt(r,10)!==r)throw new Error("Modulus is not an integer");return parseInt(e,10)===e&&e%n===r}(r,t)},$ne:function(e,t,n,r){return t.every((function(e){return 0!==dt(r,e)}))},$in:function(e,t,n,r){return bt(r)&&kt(r,t)},$nin:function(e,t,n,r){return bt(r)&&!kt(r,t)},$size:function(e,t,n,r){return bt(r)&&function(e,t){return e.length===t}(r,t)},$all:function(e,t,n,r){return Array.isArray(r)&&function(e,t){return t.every((function(t){return e.indexOf(t)>-1}))}(r,t)},$regex:function(e,t,n,r){return bt(r)&&function(e,t){return new RegExp(t).test(e)}(r,t)},$type:function(e,t,n,r){return function(e,t){switch(t){case"null":return null===e;case"boolean":return"boolean"==typeof e;case"number":return"number"==typeof e;case"string":return"string"==typeof e;case"array":return e instanceof Array;case"object":return"[object Object]"==={}.toString.call(e)}throw new Error(t+" not supported as a type.Please use one of object, string, array, number, boolean or null.")}(r,t)}};
// return true if the given doc matches the supplied selector
function Ot(e,t){if(e.selector&&e.filter&&"_selector"!==e.filter){var n="string"==typeof e.filter?e.filter:"function";return t(new Error('selector invalid for filter "'+n+'"'))}t()}function At(e){e.view&&!e.filter&&(e.filter="_view"),e.selector&&!e.filter&&(e.filter="_selector"),e.filter&&"string"==typeof e.filter&&("_view"===e.filter?e.view=oe(e.view):e.filter=oe(e.filter))}function qt(e,t){return t.filter&&"string"==typeof t.filter&&!t.doc_ids&&!ne(e.db)}function St(e,t){var n=t.complete;if("_view"===t.filter){if(!t.view||"string"!=typeof t.view){var r=H(V,"`view` filter parameter not found or invalid.");return n(r)}
// fetch a view from a design doc, make it behave like a filter
var o=re(t.view);e.db.get("_design/"+o[0],(function(r,i){
/* istanbul ignore if */
if(e.isCancelled)return n(null,{status:"cancelled"});
/* istanbul ignore next */if(r)return n(X(r));var s=i&&i.views&&i.views[o[1]]&&i.views[o[1]].map;if(!s)return n(H(B,i.views?"missing json key: "+o[1]:"missing json key: views"));t.filter=fe(["return function(doc) {",'  "use strict";',"  var emitted = false;","  var emit = function (a, b) {","    emitted = true;","  };","  var view = "+s+";","  view(doc);","  if (emitted) {","    return true;","  }","};"].join("\n"),{}),e.doChanges(t)}))}else if(t.selector)t.filter=function(e){return function(e,t){
/* istanbul ignore if */
if("object"!=typeof t)
// match the CouchDB error message
throw new Error("Selector error: expected a JSON object");var n=function(e,t,n){if(e=e.filter((function(e){return _t(e.doc,t.selector,n)})),t.sort){
// in-memory sort
var r=function(e){function t(t){return e.map((function(e){var n=ot(at(e));return rt(t,n)}))}return function(e,n){var r,o,i=dt(t(e.doc),t(n.doc));return 0!==i?i:(r=e.doc._id)<(o=n.doc._id)?-1:r>o?1:0;
// this is what mango seems to do
}}(t.sort);e=e.sort(r),"string"!=typeof t.sort[0]&&"desc"===(o=t.sort[0])[at(o)]&&(e=e.reverse())}var o;if("limit"in t||"skip"in t){
// have to do the limit in-memory
var i=t.skip||0,s=("limit"in t?t.limit:e.length)+i;e=e.slice(i,s)}return e}([{doc:e}],{selector:t=lt(t)},Object.keys(t));return n&&1===n.length}(e,t.selector)},e.doChanges(t);else{
// fetch a filter from a design doc
var i=re(t.filter);e.db.get("_design/"+i[0],(function(r,o){
/* istanbul ignore if */
if(e.isCancelled)return n(null,{status:"cancelled"});
/* istanbul ignore next */if(r)return n(X(r));var s=o&&o.filters&&o.filters[i[1]];if(!s)return n(H(B,o&&o.filters?"missing json key: "+i[1]:"missing json key: filters"));t.filter=fe('"use strict";\nreturn '+s+";",{}),e.doChanges(t)}))}}function xt(e){return e.reduce((function(e,t){return e[t]=!0,e}),{})}
// List of top level reserved words for doc
// TODO: remove from pouchdb-core (breaking)
Xe.plugin((function(e){e._changesFilterPlugin={validate:Ot,normalize:At,shouldFilter:qt,filter:St}})),Xe.version="7.2.2";var Et=xt(["_id","_rev","_attachments","_deleted","_revisions","_revs_info","_conflicts","_deleted_conflicts","_local_seq","_rev_tree",
//replication documents
"_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats",
// Specific to Couchbase Sync Gateway
"_removed"]),Ct=xt(["_attachments",
//replication documents
"_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats"]);
// List of reserved words that should end up the document
function Pt(e){if(!/^\d+-/.test(e))return H(W);var t=e.indexOf("-"),n=e.substring(0,t),r=e.substring(t+1);return{prefix:parseInt(n,10),id:r}}
// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
function Lt(e,t,n){var r,o,i;n||(n={deterministic_revs:!0});var s={status:"available"};if(e._deleted&&(s.deleted=!0),t)if(e._id||(e._id=Se()),o=qe(e,n.deterministic_revs),e._rev){if((i=Pt(e._rev)).error)return i;e._rev_tree=[{pos:i.prefix,ids:[i.id,{status:"missing"},[[o,s,[]]]]}],r=i.prefix+1}else e._rev_tree=[{pos:1,ids:[o,s,[]]}],r=1;else if(e._revisions&&(e._rev_tree=function(e,t){for(var n=e.start-e.ids.length+1,r=e.ids,o=[r[0],t,[]],i=1,s=r.length;i<s;i++)o=[r[i],{status:"missing"},[o]];return[{pos:n,ids:o}]}(e._revisions,s),r=e._revisions.start,o=e._revisions.ids[0]),!e._rev_tree){if((i=Pt(e._rev)).error)return i;r=i.prefix,o=i.id,e._rev_tree=[{pos:r,ids:[o,s,[]]}]}te(e._id),e._rev=r+"-"+o;var a={metadata:{},data:{}};for(var u in e)
/* istanbul ignore else */
if(Object.prototype.hasOwnProperty.call(e,u)){var c="_"===u[0];if(c&&!Et[u]){var f=H(z,u);throw f.message=z.message+": "+u,f}c&&!Ct[u]?a.metadata[u.slice(1)]=e[u]:a.data[u]=e[u]}return a}function Dt(e,t,n){if(e.stub)return n();"string"==typeof e.data?// input is a base64 string
function(e,t,n){var r=function(e){try{return de(e)}catch(e){return{error:H(K,"Attachment is not a valid base64 string")}}}(e.data);if(r.error)return n(r.error);e.length=r.length,e.data="blob"===t?ye(r,e.content_type):"base64"===t?he(r):r,Oe(r,(function(t){e.digest="md5-"+t,n()}))}(e,t,n):// input is a blob
function(e,t,n){Oe(e.data,(function(r){e.digest="md5-"+r,
// size is for blobs (browser), length is for buffers (node)
e.length=e.data.size||e.data.length||0,"binary"===t?me(e.data,(function(t){e.data=t,n()})):"base64"===t?be(e.data,(function(t){e.data=t,n()})):n()}))}(e,t,n)}function $t(e,t,n,r,o,s,a,u,c){
// Default to 1000 locally
e=e||1e3;var f=u.new_edits,l=new i,d=0,h=t.length;function p(){++d===h&&c&&c()}t.forEach((function(e,t){if(e._id&&Ke(e._id)){var r=e._deleted?"_removeLocal":"_putLocal";n[r](e,{ctx:o},(function(e,n){s[t]=e||n,p()}))}else{var i=e.metadata.id;l.has(i)?(h--,// duplicate
l.get(i).push([e,t])):l.set(i,[[e,t]])}})),
// in the case of new_edits, the user can provide multiple docs
// with the same id. these need to be processed sequentially
l.forEach((function(t,n){var o=0;function i(){++o<t.length?c():p()}function c(){var c=t[o],l=c[0],d=c[1];if(r.has(n))!function(e,t,n,r,o,i,s,a){if(function(e,t){for(var n,r=e.slice(),o=t.split("-"),i=parseInt(o[0],10),s=o[1];n=r.pop();){if(n.pos===i&&n.ids[0]===s)return!0;for(var a=n.ids[2],u=0,c=a.length;u<c;u++)r.push({pos:n.pos+1,ids:a[u]})}return!1}(t.rev_tree,n.metadata.rev)&&!a)return r[o]=n,i();
// sometimes this is pre-calculated. historically not always
var u=t.winningRev||xe(t),c="deleted"in t?t.deleted:Fe(t,u),f="deleted"in n.metadata?n.metadata.deleted:Fe(n.metadata),l=/^1-/.test(n.metadata.rev);if(c&&!f&&a&&l){var d=n.data;d._rev=u,d._id=n.metadata.id,n=Lt(d,a)}var h=Ue(t.rev_tree,n.metadata.rev_tree[0],e);if(a&&(c&&f&&"new_leaf"!==h.conflicts||!c&&"new_leaf"!==h.conflicts||c&&!f&&"new_branch"===h.conflicts)){var p=H(M);return r[o]=p,i()}var v=n.metadata.rev;n.metadata.rev_tree=h.tree,n.stemmedRevs=h.stemmedRevs||[],
/* istanbul ignore else */
t.rev_map&&(n.metadata.rev_map=t.rev_map);
// recalculate
var y=xe(n.metadata),g=Fe(n.metadata,y),_=c===g?0:c<g?-1:1;s(n,y,g,v===y?g:Fe(n.metadata,v),!0,_,o,i)}(e,r.get(n),l,s,d,i,a,f);else{
// Ensure stemming applies to new writes as well
var h=Ue([],l.metadata.rev_tree[0],e);l.metadata.rev_tree=h.tree,l.stemmedRevs=h.stemmedRevs||[],function(e,t,n){
// Cant insert new deleted documents
var r=xe(e.metadata),o=Fe(e.metadata,r);if("was_delete"in u&&o)return s[t]=H(B,"deleted"),n();
// 4712 - detect whether a new document was inserted with a _rev
var i=f&&function(e){return"missing"===e.metadata.rev_tree[0].ids[1].status}(e);if(i){var c=H(M);return s[t]=c,n()}a(e,r,o,o,!1,o?0:1,t,n)}(l,d,i)}}c()}))}
// IndexedDB requires a versioned database structure, so we use the
// version here to manage migrations.
var It="document-store",Tt="by-sequence",Bt="attach-store",Mt="attach-seq-store",Rt="meta-store",Ut="local-store",Nt="detect-blob-support";
// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
// Keyed by document id
function Ft(e){try{return JSON.stringify(e)}catch(t){
/* istanbul ignore next */
return c.stringify(e)}}function Kt(e){return function(t){var n="unknown_error";t.target&&t.target.error&&(n=t.target.error.name||t.target.error.message),e(H(Q,n,t.type))}}
// Unfortunately, the metadata has to be stringified
// when it is put into the database, because otherwise
// IndexedDB can throw errors for deeply-nested objects.
// Originally we just used JSON.parse/JSON.stringify; now
// we use this custom vuvuzela library that avoids recursion.
// If we could do it all over again, we'd probably use a
// format for the revision trees other than JSON.
function Jt(e,t,n){return{data:Ft(e),winningRev:t,deletedOrLocal:n?"1":"0",seq:e.seq,// highest seq for this doc
id:e.id}}function zt(e){if(!e)return null;var t=function(e){
// This try/catch guards against stack overflow errors.
// JSON.parse() is faster than vuvuzela.parse() but vuvuzela
// cannot overflow.
try{return JSON.parse(e)}catch(t){
/* istanbul ignore next */
return c.parse(e)}}(e.data);return t.winningRev=e.winningRev,t.deleted="1"===e.deletedOrLocal,t.seq=e.seq,t}
// read the doc back out from the database. we don't store the
// _id or _rev because we already have _doc_id_rev.
function Vt(e){if(!e)return e;var t=e._doc_id_rev.lastIndexOf(":");return e._id=e._doc_id_rev.substring(0,t-1),e._rev=e._doc_id_rev.substring(t+1),delete e._doc_id_rev,e}
// Read a blob from the database, encoding as necessary
// and translating from base64 if the IDB doesn't support
// native Blobs
function Gt(e,t,n,r){n?// we have blob support
r(e?"string"!=typeof e?e:ge(e,t):pe([""],{type:t})):// as base64 string
e?"string"!=typeof e?// we have blob support
_e(e,(function(e){r(he(e))})):// no blob support
r(e):r("")}function Qt(e,t,n,r){var o=Object.keys(e._attachments||{});if(!o.length)return r&&r();var i=0;function s(){++i===o.length&&r&&r()}o.forEach((function(r){t.attachments&&t.include_docs?function(e,t){var r=e._attachments[t],o=r.digest;n.objectStore(Bt).get(o).onsuccess=function(e){r.body=e.target.result.body,s()}}(e,r):(e._attachments[r].stub=!0,s())}))}
// IDB-specific postprocessing necessary because
// we don't know whether we stored a true Blob or
// a base64-encoded string, and if it's a Blob it
// needs to be read outside of the transaction context
function Wt(e,t){return Promise.all(e.map((function(e){if(e.doc&&e.doc._attachments){var n=Object.keys(e.doc._attachments);return Promise.all(n.map((function(n){var r=e.doc._attachments[n];if("body"in r){var o=r.body,i=r.content_type;return new Promise((function(s){Gt(o,i,t,(function(t){e.doc._attachments[n]=$(A(r,["digest","content_type"]),{data:t}),s()}))}))}})))}})))}function Yt(e,t,n){var r=[],o=n.objectStore(Tt),i=n.objectStore(Bt),s=n.objectStore(Mt),a=e.length;function u(){--a||r.length&&r.forEach((function(e){s.index("digestSeq").count(IDBKeyRange.bound(e+"::",e+"::￿",!1,!1)).onsuccess=function(t){t.target.result||
// orphaned
i.delete(e)}}))}e.forEach((function(e){var n=o.index("_doc_id_rev"),i=t+"::"+e;n.getKey(i).onsuccess=function(e){var t=e.target.result;if("number"!=typeof t)return u();o.delete(t),s.index("seq").openCursor(IDBKeyRange.only(t)).onsuccess=function(e){var t=e.target.result;if(t){var n=t.value.digestSeq.split("::")[0];r.push(n),s.delete(t.primaryKey),t.continue()}else// done
u()}}}))}function Ht(e,t,n){try{return{txn:e.transaction(t,n)}}catch(e){return{error:e}}}var Xt=new C;function Zt(e,t,n,r,o,s){for(var a,u,c,f,l,d,h,p,v=t.docs,y=0,g=v.length;y<g;y++){var _=v[y];_._id&&Ke(_._id)||(_=v[y]=Lt(_,n.new_edits,e)).error&&!h&&(h=_)}if(h)return s(h);var m=!1,b=0,w=new Array(v.length),k=new i,j=!1,O=r._meta.blobSupport?"blob":"base64";function A(){m=!0,q()}function q(){p&&m&&(
// caching the docCount saves a lot of time in allDocs() and
// info(), which is why we go to all the trouble of doing this
p.docCount+=b,d.put(p))}function S(){j||(Xt.notify(r._meta.name),s(null,w))}function x(e,t,n,r,o,i,s,a){e.metadata.winningRev=t,e.metadata.deleted=n;var u=e.data;if(u._id=e.metadata.id,u._rev=e.metadata.rev,r&&(u._deleted=!0),u._attachments&&Object.keys(u._attachments).length)return function(e,t,n,r,o,i){var s=e.data,a=0,u=Object.keys(s._attachments);function c(){a===u.length&&E(e,t,n,r,o,i)}function l(){a++,c()}u.forEach((function(n){var r=e.data._attachments[n];if(r.stub)a++,c();else{var o=r.data;delete r.data,r.revpos=parseInt(t,10),function(e,t,n){f.count(e).onsuccess=function(r){if(r.target.result)return n();// already exists
var o={digest:e,body:t};f.put(o).onsuccess=n}}(r.digest,o,l)}}))}
// map seqs to attachment digests, which
// we will need later during compaction
(e,t,n,o,s,a);b+=i,q(),E(e,t,n,o,s,a)}function E(e,t,n,o,i,s){var f=e.data,d=e.metadata;function h(i){var s=e.stemmedRevs||[];o&&r.auto_compaction&&(s=s.concat(function(e){var t=[];return Ee(e.rev_tree,(function(e,n,r,o,i){"available"!==i.status||e||(t.push(n+"-"+r),i.status="missing")})),t}(e.metadata))),s&&s.length&&Yt(s,e.metadata.id,a),d.seq=i.target.result;
// Current _rev is calculated from _rev_tree on read
// delete metadata.rev;
var c=Jt(d,t,n);u.put(c).onsuccess=p}function p(){w[i]={ok:!0,id:d.id,rev:d.rev},k.set(e.metadata.id,e.metadata),function(e,t,n){var r=0,o=Object.keys(e.data._attachments||{});if(!o.length)return n();function i(){++r===o.length&&n()}function s(n){var r=e.data._attachments[n].digest,o=l.put({seq:t,digestSeq:r+"::"+t});o.onsuccess=i,o.onerror=function(e){
// this callback is for a constaint error, which we ignore
// because this docid/rev has already been associated with
// the digest (e.g. when new_edits == false)
e.preventDefault(),// avoid transaction abort
e.stopPropagation(),// avoid transaction onerror
i()}}for(var a=0;a<o.length;a++)s(o[a]);// do in parallel
}(e,d.seq,s)}f._doc_id_rev=d.id+"::"+d.rev,delete f._id,delete f._rev;var v=c.put(f);v.onsuccess=h,v.onerror=function(e){
// ConstraintError, need to update, not put (see #1638 for details)
e.preventDefault(),// avoid transaction abort
e.stopPropagation(),c.index("_doc_id_rev").getKey(f._doc_id_rev).onsuccess=function(e){c.put(f,e.target.result).onsuccess=h}}}!function(e,t,n){if(!e.length)return n();var r,o=0;function i(){o++,e.length===o&&(r?n(r):n())}e.forEach((function(e){var n=e.data&&e.data._attachments?Object.keys(e.data._attachments):[],o=0;if(!n.length)return i();function s(e){r=e,++o===n.length&&i()}for(var a in e.data._attachments)e.data._attachments.hasOwnProperty(a)&&Dt(e.data._attachments[a],t,s)}))}(v,O,(function(t){if(t)return s(t);!function(){var t=Ht(o,[It,Tt,Bt,Ut,Mt,Rt],"readwrite");if(t.error)return s(t.error);(a=t.txn).onabort=Kt(s),a.ontimeout=Kt(s),a.oncomplete=S,u=a.objectStore(It),c=a.objectStore(Tt),f=a.objectStore(Bt),l=a.objectStore(Mt),(d=a.objectStore(Rt)).get(Rt).onsuccess=function(e){p=e.target.result,q()},function(e){var t=[];if(v.forEach((function(e){e.data&&e.data._attachments&&Object.keys(e.data._attachments).forEach((function(n){var r=e.data._attachments[n];r.stub&&t.push(r.digest)}))})),!t.length)return e();var n,r=0;function o(){++r===t.length&&e(n)}t.forEach((function(e){!function(e,t){f.get(e).onsuccess=function(n){if(n.target.result)t();else{var r=H(Y,"unknown stub attachment with digest "+e);r.status=412,t(r)}}}(e,(function(e){e&&!n&&(n=e),o()}))}))}((function(t){if(t)return j=!0,s(t);!function(){if(v.length)for(var t=0,o=0,i=v.length;o<i;o++){var s=v[o];s._id&&Ke(s._id)?c():u.get(s.metadata.id).onsuccess=f}function c(){++t===v.length&&$t(e.revs_limit,v,r,k,a,w,x,n,A)}function f(e){var t=zt(e.target.result);t&&k.set(t.id,t),c()}}()}))}()}))}
// Abstraction over IDBCursor and getAll()/getAllKeys() that allows us to batch our operations
// while falling back to a normal IDBCursor operation on browsers that don't support getAll() or
// getAllKeys(). This allows for a much faster implementation than just straight-up cursors, because
// we're not processing each document one-at-a-time.
function en(e,t,n,r,o){
// Bail out of getAll()/getAllKeys() in the following cases:
// 1) either method is unsupported - we need both
// 2) batchSize is 1 (might as well use IDBCursor)
// 3) descending – no real way to do this via getAll()/getAllKeys()
var i,s,a;function u(e){s=e.target.result,i&&o(i,s,a)}function c(e){i=e.target.result,s&&o(i,s,a)}function f(e){var t=e.target.result;if(!t)// done
return o();
// regular IDBCursor acts like a batch where batch size is always 1
o([t.key],[t.value],t)}-1===r&&(r=1e3),"function"==typeof e.getAll&&"function"==typeof e.getAllKeys&&r>1&&!n?(a={continue:function(){if(!i.length)// no more results
return o();
// fetch next batch, exclusive start
var n,a=i[i.length-1];if(t&&t.upper)try{n=IDBKeyRange.bound(a,t.upper,!0,t.upperOpen)}catch(e){if("DataError"===e.name&&0===e.code)return o();// we're done, startkey and endkey are equal
}else n=IDBKeyRange.lowerBound(a,!0);t=n,i=null,s=null,e.getAll(t,r).onsuccess=u,e.getAllKeys(t,r).onsuccess=c}},e.getAll(t,r).onsuccess=u,e.getAllKeys(t,r).onsuccess=c):n?e.openCursor(t,"prev").onsuccess=f:e.openCursor(t).onsuccess=f}
// simple shim for objectStore.getAll(), falling back to IDBCursor
function tn(e,t,n){var r,o,i="startkey"in e&&e.startkey,s="endkey"in e&&e.endkey,a="key"in e&&e.key,u="keys"in e&&e.keys,c=e.skip||0,f="number"==typeof e.limit?e.limit:-1,l=!1!==e.inclusive_end;if(!u&&(r=function(e,t,n,r,o){try{if(e&&t)return o?IDBKeyRange.bound(t,e,!n,!1):IDBKeyRange.bound(e,t,!1,!n);if(e)return o?IDBKeyRange.upperBound(e):IDBKeyRange.lowerBound(e);if(t)return o?IDBKeyRange.lowerBound(t,!n):IDBKeyRange.upperBound(t,!n);if(r)return IDBKeyRange.only(r)}catch(e){return{error:e}}return null}(i,s,l,a,e.descending),(o=r&&r.error)&&("DataError"!==o.name||0!==o.code)))
// DataError with error code 0 indicates start is less than end, so
// can just do an empty query. Else need to throw
return n(H(Q,o.name,o.message));var d=[It,Tt,Rt];e.attachments&&d.push(Bt);var h=Ht(t,d,"readonly");if(h.error)return n(h.error);var p=h.txn;p.oncomplete=function(){e.attachments?Wt(w,e.binary).then(A):A()}
// don't bother doing any requests if start > end or limit === 0
,p.onabort=Kt(n);var v,y,g=p.objectStore(It),_=p.objectStore(Tt),m=p.objectStore(Rt),b=_.index("_doc_id_rev"),w=[];function k(t,n){var r={id:n.id,key:n.id,value:{rev:t}};n.deleted?u&&(w.push(r),
// deleted docs are okay with "keys" requests
r.value.deleted=!0,r.doc=null):c--<=0&&(w.push(r),e.include_docs&&
// if the user specifies include_docs=true, then we don't
// want to block the main cursor while we're fetching the doc
function(t,n,r){var o=t.id+"::"+r;b.get(o).onsuccess=function(r){if(n.doc=Vt(r.target.result)||{},e.conflicts){var o=Le(t);o.length&&(n.doc._conflicts=o)}Qt(n.doc,e,p)}}(n,r,t))}function j(e){for(var t=0,n=e.length;t<n&&w.length!==f;t++){var r=e[t];if(r.error&&u)
// key was not found with "keys" requests
w.push(r);else{var o=zt(r);k(o.winningRev,o)}}}function O(e,t,n){n&&(j(t),w.length<f&&n.continue())}function A(){var t={total_rows:v,offset:e.skip,rows:w};
/* istanbul ignore if */e.update_seq&&void 0!==y&&(t.update_seq=y),n(null,t)}return m.get(Rt).onsuccess=function(e){v=e.target.result.docCount},
/* istanbul ignore if */
e.update_seq&&function(e,t){e.openCursor(null,"prev").onsuccess=function(e){var t=e.target.result,n=void 0;return t&&t.key&&(n=t.key),function(e){e.target.result&&e.target.result.length>0&&(y=e.target.result[0])}({target:{result:[n]}})}}(_),o||0===f?void 0:u?function(e,t,n){
// It's not guaranted to be returned in right order  
var r=new Array(e.length),o=0;e.forEach((function(i,s){t.get(i).onsuccess=function(t){t.target.result?r[s]=t.target.result:r[s]={key:i,error:"not_found"},++o===e.length&&n(e,r,{})}}))}(e.keys,g,O):-1===f?function(e,t,n){if("function"!=typeof e.getAll){
// fall back to cursors
var r=[];e.openCursor(t).onsuccess=function(e){var t=e.target.result;t?(r.push(t.value),t.continue()):n({target:{result:r}})}}else
// use native getAll
e.getAll(t).onsuccess=n}(g,r,(function(t){var n=t.target.result;e.descending&&(n=n.reverse()),j(n)})):
// else do a cursor
// choose a batch size based on the skip, since we'll need to skip that many
void en(g,r,e.descending,f+c,O)}
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
// This task queue ensures that IDB open calls are done in their own tick
var nn=!1,rn=[];function on(){!nn&&rn.length&&(nn=!0,rn.shift()())}function sn(e,t,n,r){if((e=w(e)).continuous){var s=n+":"+Se();return Xt.addListener(n,s,t,e),Xt.notify(n),{cancel:function(){Xt.removeListener(n,s)}}}var a=e.doc_ids&&new o(e.doc_ids);e.since=e.since||0;var u=e.since,c="limit"in e?e.limit:-1;0===c&&(c=1);var f,l,d,h,p=[],v=0,y=Z(e),g=new i;function _(e,t,n,r){if(n.seq!==t)
// some other seq is later
return r();if(n.winningRev===e._rev)
// this is the winning doc
return r(n,e);
// fetch winning doc in separate request
var o=e._id+"::"+n.winningRev;h.get(o).onsuccess=function(e){r(n,Vt(e.target.result))}}function m(){e.complete(null,{results:p,last_seq:u})}var b=[It,Tt];e.attachments&&b.push(Bt);var k=Ht(r,b,"readonly");if(k.error)return e.complete(k.error);(f=k.txn).onabort=Kt(e.complete),f.oncomplete=function(){!e.continuous&&e.attachments?
// cannot guarantee that postProcessing was already done,
// so do it again
Wt(p).then(m):m()},l=f.objectStore(Tt),d=f.objectStore(It),h=l.index("_doc_id_rev"),en(l,e.since&&!e.descending?IDBKeyRange.lowerBound(e.since,!0):null,e.descending,c,(function(t,n,r){if(r&&t.length){var o=new Array(t.length),i=new Array(t.length),s=0;n.forEach((function(n,u){!function(e,t,n){if(a&&!a.has(e._id))return n();var r=g.get(e._id);if(r)// cached
return _(e,t,r,n);
// metadata not cached, have to go fetch it
d.get(e._id).onsuccess=function(o){r=zt(o.target.result),g.set(e._id,r),_(e,t,r,n)}}(Vt(n),t[u],(function(n,a){i[u]=n,o[u]=a,++s===t.length&&function(){for(var t=[],n=0,s=o.length;n<s&&v!==c;n++){var a=o[n];if(a){var u=i[n];t.push(l(u,a))}}Promise.all(t).then((function(t){for(var n=0,r=t.length;n<r;n++)t[n]&&e.onChange(t[n])})).catch(e.complete),v!==c&&r.continue()}
// Fetch all metadatas/winningdocs from this batch in parallel, then process
// them all only once all data has been collected. This is done in parallel
// because it's faster than doing it one-at-a-time.
()}))}))}function l(t,n){var r=e.processChange(n,t,e);u=r.seq=t.seq;var o=y(r);return"object"==typeof o?Promise.reject(o):o?(v++,e.return_docs&&p.push(r),
// process the attachment immediately
// for the benefit of live listeners
e.attachments&&e.include_docs?new Promise((function(t){Qt(n,e,f,(function(){Wt([r],e.binary).then((function(){t(r)}))}))})):Promise.resolve(r)):Promise.resolve()}}))}var an,un=new i,cn=new i;function fn(e,t){var n=this;!function(e,t,n){rn.push((function(){e((function(e,r){!function(e,t,n,r){try{e(t,n)}catch(t){
// Shouldn't happen, but in some odd cases
// IndexedDB implementations might throw a sync
// error, in which case this will at least log it.
r.emit("error",t)}}(t,e,r,n),nn=!1,s((function(){on()}))}))})),on()}((function(t){!function(e,t,n){var r=t.name,o=null;
// called when creating a fresh new database
// migration to version 2
// unfortunately "deletedOrLocal" is a misnomer now that we no longer
// store local docs in the main doc-store, but whaddyagonnado
function i(e,t){var n=e.objectStore(It);n.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),n.openCursor().onsuccess=function(e){var r=e.target.result;if(r){var o=r.value,i=Fe(o);o.deletedOrLocal=i?"1":"0",n.put(o),r.continue()}else t()}}
// migration to version 3 (part 1)
// migration to version 3 (part 2)
function a(e,t){var n=e.objectStore(Ut),r=e.objectStore(It),o=e.objectStore(Tt);r.openCursor().onsuccess=function(e){var i=e.target.result;if(i){var s=i.value,a=s.id,u=Ke(a),c=xe(s);if(u){var f=a+"::"+c,l=a+"::",d=a+"::~",h=o.index("_doc_id_rev"),p=IDBKeyRange.bound(l,d,!1,!1),v=h.openCursor(p);
// remove all seq entries
// associated with this docId
v.onsuccess=function(e){if(v=e.target.result){var t=v.value;t._doc_id_rev===f&&n.put(t),o.delete(v.primaryKey),v.continue()}else
// done
r.delete(i.primaryKey),i.continue()}}else i.continue()}else t&&t()}}
// migration to version 4 (part 1)
// migration to version 4 (part 2)
function u(e,t){var n=e.objectStore(Tt),r=e.objectStore(Bt),o=e.objectStore(Mt);r.count().onsuccess=function(e){if(!e.target.result)return t();// done
n.openCursor().onsuccess=function(e){var n=e.target.result;if(!n)return t();// done
for(var r=n.value,i=n.primaryKey,s=Object.keys(r._attachments||{}),a={},u=0;u<s.length;u++)a[r._attachments[s[u]].digest]=!0;var c=Object.keys(a);for(u=0;u<c.length;u++){var f=c[u];o.put({seq:i,digestSeq:f+"::"+i})}n.continue()}}}
// migration to version 5
// Instead of relying on on-the-fly migration of metadata,
// this brings the doc-store to its modern form:
// - metadata.winningrev
// - metadata.seq
// - stringify the metadata when storing it
function c(e){
// ensure that every metadata has a winningRev and seq,
// which was previously created on-the-fly but better to migrate
var t=e.objectStore(Tt),n=e.objectStore(It);n.openCursor().onsuccess=function(e){var r=e.target.result;if(r){var o=function(e){return e.data?zt(e):(
// old format, when we didn't store it stringified
e.deleted="1"===e.deletedOrLocal,e)}(r.value);if(o.winningRev=o.winningRev||xe(o),o.seq)return i();!function(){
// metadata.seq was added post-3.2.0, so if it's missing,
// we need to fetch it manually
var e=o.id+"::",n=o.id+"::￿",r=t.index("_doc_id_rev").openCursor(IDBKeyRange.bound(e,n)),s=0;r.onsuccess=function(e){var t=e.target.result;if(!t)return o.seq=s,i();var n=t.primaryKey;n>s&&(s=n),t.continue()}}()}function i(){var e=Jt(o,o.winningRev,o.deleted);n.put(e).onsuccess=function(){r.continue()}}}}e._meta=null,e._remote=!1,e.type=function(){return"idb"},e._id=j((function(t){t(null,e._meta.instanceId)})),e._bulkDocs=function(n,r,i){Zt(t,n,r,e,o,i)},
// First we look up the metadata in the ids database, then we fetch the
// current revision(s) from the by sequence store
e._get=function(e,t,n){var r,i,s,a=t.ctx;if(!a){var u=Ht(o,[It,Tt,Bt],"readonly");if(u.error)return n(u.error);a=u.txn}function c(){n(s,{doc:r,metadata:i,ctx:a})}a.objectStore(It).get(e).onsuccess=function(e){
// we can determine the result here if:
// 1. there is no such document
// 2. the document is deleted and we don't ask about specific rev
// When we ask with opts.rev we expect the answer to be either
// doc (possibly with _deleted=true) or missing error
if(!(i=zt(e.target.result)))return s=H(B,"missing"),c();var n;if(t.rev)n=t.latest?function(e,t){for(var n,r=t.rev_tree.slice();n=r.pop();){var o=n.pos,i=n.ids,s=i[0],a=i[1],u=i[2],c=0===u.length,f=n.history?n.history.slice():[];if(f.push({id:s,pos:o,opts:a}),c)for(var l=0,d=f.length;l<d;l++){var h=f[l];if(h.pos+"-"+h.id===e)
// return the rev of this leaf
return o+"-"+s}for(var p=0,v=u.length;p<v;p++)r.push({pos:o+1,ids:u[p],history:f})}
/* istanbul ignore next */throw new Error("Unable to resolve latest revision for id "+t.id+", rev "+e)}(t.rev,i):t.rev;else if(n=i.winningRev,Fe(i))return s=H(B,"deleted"),c();var o=a.objectStore(Tt),u=i.id+"::"+n;o.index("_doc_id_rev").get(u).onsuccess=function(e){if((r=e.target.result)&&(r=Vt(r)),!r)return s=H(B,"missing"),c();c()}}},e._getAttachment=function(e,t,n,r,i){var s;if(r.ctx)s=r.ctx;else{var a=Ht(o,[It,Tt,Bt],"readonly");if(a.error)return i(a.error);s=a.txn}var u=n.digest,c=n.content_type;s.objectStore(Bt).get(u).onsuccess=function(e){Gt(e.target.result.body,c,r.binary,(function(e){i(null,e)}))}},e._info=function(t){var n,r,i=Ht(o,[Rt,Tt],"readonly");if(i.error)return t(i.error);var s=i.txn;s.objectStore(Rt).get(Rt).onsuccess=function(e){r=e.target.result.docCount},s.objectStore(Tt).openCursor(null,"prev").onsuccess=function(e){var t=e.target.result;n=t?t.key:0},s.oncomplete=function(){t(null,{doc_count:r,update_seq:n,
// for debugging
idb_attachment_format:e._meta.blobSupport?"binary":"base64"})}},e._allDocs=function(e,t){tn(e,o,t)},e._changes=function(t){return sn(t,e,r,o)},e._close=function(e){
// https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
// "Returns immediately and closes the connection in a separate thread..."
o.close(),un.delete(r),e()},e._getRevisionTree=function(e,t){var n=Ht(o,[It],"readonly");if(n.error)return t(n.error);n.txn.objectStore(It).get(e).onsuccess=function(e){var n=zt(e.target.result);n?t(null,n.rev_tree):t(H(B))}},
// This function removes revisions of document docId
// which are listed in revs and sets this document
// revision to to rev_tree
e._doCompaction=function(e,t,n){var r=Ht(o,[It,Tt,Bt,Mt],"readwrite");if(r.error)return n(r.error);var i=r.txn;i.objectStore(It).get(e).onsuccess=function(n){var r=zt(n.target.result);Ee(r.rev_tree,(function(e,n,r,o,i){var s=n+"-"+r;-1!==t.indexOf(s)&&(i.status="missing")})),Yt(t,e,i);var o=r.winningRev,s=r.deleted;i.objectStore(It).put(Jt(r,o,s))},i.onabort=Kt(n),i.oncomplete=function(){n()}},e._getLocal=function(e,t){var n=Ht(o,[Ut],"readonly");if(n.error)return t(n.error);var r=n.txn.objectStore(Ut).get(e);r.onerror=Kt(t),r.onsuccess=function(e){var n=e.target.result;n?(delete n._doc_id_rev,// for backwards compat
t(null,n)):t(H(B))}},e._putLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),delete e._revisions;// ignore this, trust the rev
var r=e._rev,i=e._id;e._rev=r?"0-"+(parseInt(r.split("-")[1],10)+1):"0-1";var s,a=t.ctx;if(!a){var u=Ht(o,[Ut],"readwrite");if(u.error)return n(u.error);(a=u.txn).onerror=Kt(n),a.oncomplete=function(){s&&n(null,s)}}var c,f=a.objectStore(Ut);r?(c=f.get(i)).onsuccess=function(o){var i=o.target.result;i&&i._rev===r?f.put(e).onsuccess=function(){s={ok:!0,id:e._id,rev:e._rev},t.ctx&&// return immediately
n(null,s)}:n(H(M))}:(// new doc
(c=f.add(e)).onerror=function(e){
// constraint error, already exists
n(H(M)),e.preventDefault(),// avoid transaction abort
e.stopPropagation()},c.onsuccess=function(){s={ok:!0,id:e._id,rev:e._rev},t.ctx&&// return immediately
n(null,s)})},e._removeLocal=function(e,t,n){"function"==typeof t&&(n=t,t={});var r,i=t.ctx;if(!i){var s=Ht(o,[Ut],"readwrite");if(s.error)return n(s.error);(i=s.txn).oncomplete=function(){r&&n(null,r)}}var a=e._id,u=i.objectStore(Ut),c=u.get(a);c.onerror=Kt(n),c.onsuccess=function(o){var i=o.target.result;i&&i._rev===e._rev?(u.delete(a),r={ok:!0,id:a,rev:"0-0"},t.ctx&&// return immediately
n(null,r)):n(H(B))}},e._destroy=function(e,t){Xt.removeAllListeners(r);
//Close open request for "dbName" database to fix ie delay.
var n=cn.get(r);n&&n.result&&(n.result.close(),un.delete(r));var o=indexedDB.deleteDatabase(r);o.onsuccess=function(){
//Remove open request from the list.
cn.delete(r),E()&&r in localStorage&&delete localStorage[r],t(null,{ok:!0})},o.onerror=Kt(t)};var f=un.get(r);if(f)return o=f.idb,e._meta=f.global,s((function(){n(null,e)}));var l=indexedDB.open(r,5);cn.set(r,l),l.onupgradeneeded=function(e){var t=e.target.result;if(e.oldVersion<1)return function(e){var t=e.createObjectStore(It,{keyPath:"id"});e.createObjectStore(Tt,{autoIncrement:!0}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0}),e.createObjectStore(Bt,{keyPath:"digest"}),e.createObjectStore(Rt,{keyPath:"id",autoIncrement:!1}),e.createObjectStore(Nt),
// added in v2
t.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),
// added in v3
e.createObjectStore(Ut,{keyPath:"_id"});
// added in v4
var n=e.createObjectStore(Mt,{autoIncrement:!0});n.createIndex("seq","seq"),n.createIndex("digestSeq","digestSeq",{unique:!0})}(t);// new db, initial schema
// do migrations
var n=e.currentTarget.transaction;
// these migrations have to be done in this function, before
// control is returned to the event loop, because IndexedDB
e.oldVersion<3&&function(e){e.createObjectStore(Ut,{keyPath:"_id"}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0})}(t),e.oldVersion<4&&function(e){var t=e.createObjectStore(Mt,{autoIncrement:!0});t.createIndex("seq","seq"),t.createIndex("digestSeq","digestSeq",{unique:!0})}(t);var r=[i,// v1 -> v2
a,// v2 -> v3
u,// v3 -> v4
c],o=e.oldVersion;!function e(){var t=r[o-1];o++,t&&t(n,e)}()},l.onsuccess=function(t){(o=t.target.result).onversionchange=function(){o.close(),un.delete(r)},o.onabort=function(e){P("error","Database has a global failure",e.target.error),o.close(),un.delete(r)};
// Do a few setup operations (in parallel as much as possible):
// 1. Fetch meta doc
// 2. Check blob support
// 3. Calculate docCount
// 4. Generate an instanceId if necessary
// 5. Store docCount and instanceId on meta doc
var i,s,a,u,c=o.transaction([Rt,Nt,It],"readwrite"),f=!1;function l(){void 0!==a&&f&&(e._meta={name:r,instanceId:u,blobSupport:a},un.set(r,{idb:o,global:e._meta}),n(null,e))}function d(){if(void 0!==s&&void 0!==i){var e=r+"_id";e in i?u=i[e]:i[e]=u=Se(),i.docCount=s,c.objectStore(Rt).put(i)}}
// fetch or generate the instanceId
c.objectStore(Rt).get(Rt).onsuccess=function(e){i=e.target.result||{id:Rt},d()},
// countDocs
function(e,t){e.objectStore(It).index("deletedOrLocal").count(IDBKeyRange.only("0")).onsuccess=function(e){!function(e){s=e,d()}(e.target.result)}}(c),
// check blob support
an||(
// make sure blob support is only checked once
an=function(e){return new Promise((function(t){var n=pe([""]),r=e.objectStore(Nt).put(n,"key");r.onsuccess=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),n=navigator.userAgent.match(/Edge\//);
// MS Edge pretends to be Chrome 42:
// https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
t(n||!e||parseInt(e[1],10)>=43)},r.onerror=e.onabort=function(e){
// If the transaction aborts now its due to not being able to
// write to the database, likely due to the disk being full
e.preventDefault(),e.stopPropagation(),t(!1)}})).catch((function(){return!1;// error, so assume unsupported
}))}(c)),an.then((function(e){a=e,l()})),
// only when the metadata put transaction has completed,
// consider the setup done
c.oncomplete=function(){f=!0,l()},c.onabort=Kt(n)},l.onerror=function(e){var t=e.target.error&&e.target.error.message;t?-1!==t.indexOf("stored database is a higher version")&&(t=new Error('This DB was created with the newer "indexeddb" adapter, but you are trying to open it with the older "idb" adapter')):t="Failed to open indexedDB, are you in private browsing mode?",P("error",t),n(H(Q,t))}}(n,e,t)}),t,n.constructor)}fn.valid=function(){
// Following #7085 buggy idb versions (typically Safari < 10.1) are
// considered valid.
// On Firefox SecurityError is thrown while referencing indexedDB if cookies
// are not allowed. `typeof indexedDB` also triggers the error.
try{
// some outdated implementations of IDB that appear on Samsung
// and HTC Android devices <4.4 are missing IDBKeyRange
return"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(e){return!1}};var ln=5e3,dn={};function hn(e){var t=e.doc||e.ok,n=t&&t._attachments;n&&Object.keys(n).forEach((function(e){var t=n[e];t.data=ge(t.data,t.content_type)}))}function pn(e){return/^_design/.test(e)?"_design/"+encodeURIComponent(e.slice(8)):/^_local/.test(e)?"_local/"+encodeURIComponent(e.slice(7)):encodeURIComponent(e)}function vn(e){return e._attachments&&Object.keys(e._attachments)?Promise.all(Object.keys(e._attachments).map((function(t){var n=e._attachments[t];if(n.data&&"string"!=typeof n.data)return new Promise((function(e){be(n.data,e)})).then((function(e){n.data=e}))}))):Promise.resolve()}
// Get all the information you possibly can about the URI given by name and
// return it as a suitable object.
// Generate a URL with the host data given by opts and the given path
function yn(e,t){return gn(e,e.db+"/"+t)}
// Generate a URL with the host data given by opts and the given path
function gn(e,t){
// If the host already has a path, then we need to have a path delimiter
// Otherwise, the path delimiter is the empty string
var n=e.path?"/":"";
// If the host already has a path, then we need to have a path delimiter
// Otherwise, the path delimiter is the empty string
return e.protocol+"://"+e.host+(e.port?":"+e.port:"")+"/"+e.path+n+t}function _n(e){return"?"+Object.keys(e).map((function(t){return t+"="+encodeURIComponent(e[t])})).join("&")}
// Implements the PouchDB API for dealing with CouchDB instances over HTTP
function mn(e,t){
// The functions that will be publicly available for HttpPouch
var r=this,o=function(e,t){
// encode db name if opts.prefix is a url (#5574)
if(function(e){if(!e.prefix)return!1;var t=ce(e.prefix).protocol;return"http"===t||"https"===t}(t)){var n=t.name.substr(t.prefix.length);
// Ensure prefix has a trailing slash
e=t.prefix.replace(/\/?$/,"/")+encodeURIComponent(n)}var r=ce(e);(r.user||r.password)&&(r.auth={username:r.user,password:r.password});
// Split the path part of the URI into parts using '/' as the delimiter
// after removing any leading '/' and any trailing '/'
var o=r.path.replace(/(^\/|\/$)/g,"").split("/");return r.db=o.pop(),
// Prevent double encoding of URI component
-1===r.db.indexOf("%")&&(r.db=encodeURIComponent(r.db)),r.path=o.join("/"),r}(e.name,e),i=yn(o,"");e=w(e);var a,u=function(t,n){if((n=n||{}).headers=n.headers||new tt,n.credentials="include",e.auth||o.auth){var r=e.auth||o.auth,i=r.username+":"+r.password,s=he(unescape(encodeURIComponent(i)));n.headers.set("Authorization","Basic "+s)}var a=e.headers||{};return Object.keys(a).forEach((function(e){n.headers.append(e,a[e])})),
/* istanbul ignore if */
function(e){var t="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",n=-1!==t.indexOf("msie"),r=-1!==t.indexOf("trident"),o=-1!==t.indexOf("edge"),i=!("method"in e)||"GET"===e.method;return(n||r||o)&&i}(n)&&(t+=(-1===t.indexOf("?")?"?":"&")+"_nonce="+Date.now()),(e.fetch||et)(t,n)};function c(e,t){return O(e,f((function(e){d().then((function(){return t.apply(this,e)})).catch((function(t){e.pop()(t)}))}))).bind(r)}function l(e,t,n){var r={};return(t=t||{}).headers=t.headers||new tt,t.headers.get("Content-Type")||t.headers.set("Content-Type","application/json"),t.headers.get("Accept")||t.headers.set("Accept","application/json"),u(e,t).then((function(e){return r.ok=e.ok,r.status=e.status,e.json()})).then((function(e){if(r.data=e,!r.ok){r.data.status=r.status;var t=X(r.data);if(n)return n(t);throw t}if(Array.isArray(r.data)&&(r.data=r.data.map((function(e){return e.error||e.missing?X(e):e}))),!n)return r;n(null,r.data)}))}function d(){return e.skip_setup?Promise.resolve():
// If there is a setup in process or previous successful setup
// done then we will use that
// If previous setups have been rejected we will try again
a||((a=l(i).catch((function(e){return e&&e.status&&404===e.status?(
// Doesnt exist, create it
D(404,"PouchDB is just detecting if the remote exists."),l(i,{method:"PUT"})):Promise.reject(e)})).catch((function(e){
// If we try to create a database that already exists, skipped in
// istanbul since its catching a race condition.
/* istanbul ignore if */
return!(!e||!e.status||412!==e.status)||Promise.reject(e)}))).catch((function(){a=null})),a)}function h(e){return e.split("/").map(encodeURIComponent).join("/")}
// Get the attachment
s((function(){t(null,r)})),r._remote=!0,
/* istanbul ignore next */
r.type=function(){return"http"},r.id=c("id",(function(e){u(gn(o,"")).then((function(e){return e.json()})).catch((function(){return{}})).then((function(t){
// Bad response or missing `uuid` should not prevent ID generation.
var n=t&&t.uuid?t.uuid+o.db:yn(o,"");e(null,n)}))})),
// Sends a POST request to the host calling the couchdb _compact function
//    version: The version of CouchDB it is running
r.compact=c("compact",(function(e,t){"function"==typeof e&&(t=e,e={}),e=w(e),l(yn(o,"_compact"),{method:"POST"}).then((function(){
// Ping the http if it's finished compaction
!function n(){r.info((function(r,o){
// CouchDB may send a "compact_running:true" if it's
// already compacting. PouchDB Server doesn't.
/* istanbul ignore else */
o&&!o.compact_running?t(null,{ok:!0}):setTimeout(n,e.interval||200)}))}()}))})),r.bulkGet=O("bulkGet",(function(e,t){var n=this;function r(t){var n={};e.revs&&(n.revs=!0),e.attachments&&(
/* istanbul ignore next */n.attachments=!0),e.latest&&(n.latest=!0),l(yn(o,"_bulk_get"+_n(n)),{method:"POST",body:JSON.stringify({docs:e.docs})}).then((function(n){e.attachments&&e.binary&&n.data.results.forEach((function(e){e.docs.forEach(hn)})),t(null,n.data)})).catch(t)}
/* istanbul ignore next */function i(){
// avoid "url too long error" by splitting up into multiple requests
var r=Math.ceil(e.docs.length/50),o=0,i=new Array(r);function s(e){return function(n,s){
// err is impossible because shim returns a list of errs in that case
i[e]=s.results,++o===r&&t(null,{results:ee(i)})}}for(var a=0;a<r;a++){var u=A(e,["revs","attachments","binary","latest"]);u.docs=e.docs.slice(50*a,Math.min(e.docs.length,50*(a+1))),x(n,u,s(a))}}
// mark the whole database as either supporting or not supporting _bulk_get
var s=gn(o,""),a=dn[s];
/* istanbul ignore next */"boolean"!=typeof a?
// check if this database supports _bulk_get
r((function(e,n){e?(dn[s]=!1,D(e.status,"PouchDB is just detecting if the remote supports the _bulk_get API."),i()):(dn[s]=!0,t(null,n))})):a?r(t):i()})),
// Calls GET on the host, which gets back a JSON string containing
//    couchdb: A welcome string
//    version: The version of CouchDB it is running
r._info=function(e){d().then((function(){return u(yn(o,""))})).then((function(e){return e.json()})).then((function(t){t.host=yn(o,""),e(null,t)})).catch(e)},r.fetch=function(e,t){return d().then((function(){var n="/"===e.substring(0,1)?gn(o,e.substring(1)):yn(o,e);return u(n,t)}))},
// Get the document with the given id from the database given by host.
// The id could be solely the _id in the database, or it may be a
// _design/ID or _local/ID path
r.get=c("get",(function(e,t,n){
// If no options were given, set the callback to the second parameter
"function"==typeof t&&(n=t,t={});
// List of parameters to add to the GET request
var r={};function i(e){var n=e._attachments,r=n&&Object.keys(n);if(n&&r.length)
// This limits the number of parallel xhr requests to 5 any time
// to avoid issues with maximum browser request limits
// dead simple promise pool, inspired by https://github.com/timdp/es6-promise-pool
// but much smaller in code size. limits the number of concurrent promises that are executed
return function(e,t){return new Promise((function(t,n){var r,o=0,i=0,s=0,a=e.length;function u(){++s===a?
/* istanbul ignore if */
r?n(r):t():l()}function c(){o--,u()}
/* istanbul ignore next */function f(e){o--,r=r||e,u()}function l(){for(;o<5&&i<a;)o++,e[i++]().then(c,f)}l()}))}(r.map((function(r){return function(){
// we fetch these manually in separate XHRs, because
// Sync Gateway would normally send it back as multipart/mixed,
// which we cannot parse. Also, this is more efficient than
// receiving attachments as base64-encoded strings.
return function(r){var i=n[r],s=pn(e._id)+"/"+h(r)+"?rev="+e._rev;return u(yn(o,s)).then((function(e){return"buffer"in e?e.buffer():e.blob()})).then((function(e){if(t.binary){var n=Object.getOwnPropertyDescriptor(e.__proto__,"type");return n&&!n.set||(e.type=i.content_type),e}return new Promise((function(t){be(e,t)}))})).then((function(e){delete i.stub,delete i.length,i.data=e}))}(r)}})))}(t=w(t)).revs&&(r.revs=!0),t.revs_info&&(r.revs_info=!0),t.latest&&(r.latest=!0),t.open_revs&&("all"!==t.open_revs&&(t.open_revs=JSON.stringify(t.open_revs)),r.open_revs=t.open_revs),t.rev&&(r.rev=t.rev),t.conflicts&&(r.conflicts=t.conflicts
/* istanbul ignore if */),t.update_seq&&(r.update_seq=t.update_seq),e=pn(e),l(yn(o,e+_n(r))).then((function(e){return Promise.resolve().then((function(){if(t.attachments)return n=e.data,Array.isArray(n)?Promise.all(n.map((function(e){if(e.ok)return i(e.ok)}))):i(n);var n})).then((function(){n(null,e.data)}))})).catch((function(t){t.docId=e,n(t)}))})),
// Delete the document given by doc from the database given by host.
r.remove=c("remove",(function(e,t,n,r){var i;"string"==typeof t?(
// id, rev, opts, callback style
i={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(
// doc, opts, callback style
i=e,"function"==typeof t?(r=t,n={}):(r=n,n=t));var s=i._rev||n.rev;l(yn(o,pn(i._id))+"?rev="+s,{method:"DELETE"},r).catch(r)})),r.getAttachment=c("getAttachment",(function(e,t,r,i){"function"==typeof r&&(i=r,r={});var s,a=r.rev?"?rev="+r.rev:"",c=yn(o,pn(e))+"/"+h(t)+a;u(c,{method:"GET"}).then((function(e){if(s=e.headers.get("content-type"),e.ok)return void 0===n||n.browser||"function"!=typeof e.buffer?e.blob():e.buffer();throw e})).then((function(e){
// TODO: also remove
void 0===n||n.browser||(e.type=s),i(null,e)})).catch((function(e){i(e)}))})),
// Remove the attachment given by the id and rev
r.removeAttachment=c("removeAttachment",(function(e,t,n,r){l(yn(o,pn(e)+"/"+h(t))+"?rev="+n,{method:"DELETE"},r).catch(r)})),
// Add the attachment given by blob and its contentType property
// to the document with the given id, the revision given by rev, and
// add it to the database given by host.
r.putAttachment=c("putAttachment",(function(e,t,n,r,i,s){"function"==typeof i&&(s=i,i=r,r=n,n=null);var a=pn(e)+"/"+h(t),u=yn(o,a);if(n&&(u+="?rev="+n),"string"==typeof r){
// input is assumed to be a base64 string
var c;try{c=de(r)}catch(e){return s(H(K,"Attachment is not a valid base64 string"))}r=c?ye(c,i):""}
// Add the attachment
l(u,{headers:new tt({"Content-Type":i}),method:"PUT",body:r},s).catch(s)})),
// Update/create multiple documents given by req in the database
// given by host.
r._bulkDocs=function(e,t,n){
// If new_edits=false then it prevents the database from creating
// new revision numbers for the documents. Instead it just uses
// the old ones. This is used in database replication.
e.new_edits=t.new_edits,d().then((function(){return Promise.all(e.docs.map(vn))})).then((function(){
// Update/create the documents
return l(yn(o,"_bulk_docs"),{method:"POST",body:JSON.stringify(e)},n)})).catch(n)},
// Update/create document
r._put=function(e,t,n){d().then((function(){return vn(e)})).then((function(){return l(yn(o,pn(e._id)),{method:"PUT",body:JSON.stringify(e)})})).then((function(e){n(null,e.data)})).catch((function(t){t.docId=e&&e._id,n(t)}))},
// Get a listing of the documents in the database given
// by host and ordered by increasing id.
r.allDocs=c("allDocs",(function(e,t){"function"==typeof e&&(t=e,e={});
// List of parameters to add to the GET request
var n,r={},i="GET";(e=w(e)).conflicts&&(r.conflicts=!0
/* istanbul ignore if */),e.update_seq&&(r.update_seq=!0),e.descending&&(r.descending=!0),e.include_docs&&(r.include_docs=!0),
// added in CouchDB 1.6.0
e.attachments&&(r.attachments=!0),e.key&&(r.key=JSON.stringify(e.key)),e.start_key&&(e.startkey=e.start_key),e.startkey&&(r.startkey=JSON.stringify(e.startkey)),e.end_key&&(e.endkey=e.end_key),e.endkey&&(r.endkey=JSON.stringify(e.endkey)),void 0!==e.inclusive_end&&(r.inclusive_end=!!e.inclusive_end),void 0!==e.limit&&(r.limit=e.limit),void 0!==e.skip&&(r.skip=e.skip);var s=_n(r);void 0!==e.keys&&(i="POST",n={keys:e.keys}),l(yn(o,"_all_docs"+s),{method:i,body:JSON.stringify(n)}).then((function(n){e.include_docs&&e.attachments&&e.binary&&n.data.rows.forEach(hn),t(null,n.data)})).catch(t)})),
// Get a list of changes made to documents in the database given by host.
// TODO According to the README, there should be two other methods here,
// api.changes.addListener and api.changes.removeListener.
r._changes=function(e){
// We internally page the results of a changes request, this means
// if there is a large set of changes to be returned we can start
// processing them quicker instead of waiting on the entire
// set of changes to return and attempting to process them at once
var t="batch_size"in e?e.batch_size:25;(e=w(e)).continuous&&!("heartbeat"in e)&&(e.heartbeat=1e4);var n="timeout"in e?e.timeout:3e4;
// ensure CHANGES_TIMEOUT_BUFFER applies
"timeout"in e&&e.timeout&&n-e.timeout<ln&&(n=e.timeout+ln
/* istanbul ignore if */),"heartbeat"in e&&e.heartbeat&&n-e.heartbeat<ln&&(n=e.heartbeat+ln);var r={};"timeout"in e&&e.timeout&&(r.timeout=e.timeout);var i=void 0!==e.limit&&e.limit,a=i;
// If opts.query_params exists, pass it through to the changes request.
// These parameters may be used by the filter on the source database.
if(e.style&&(r.style=e.style),(e.include_docs||e.filter&&"function"==typeof e.filter)&&(r.include_docs=!0),e.attachments&&(r.attachments=!0),e.continuous&&(r.feed="longpoll"),e.seq_interval&&(r.seq_interval=e.seq_interval),e.conflicts&&(r.conflicts=!0),e.descending&&(r.descending=!0
/* istanbul ignore if */),e.update_seq&&(r.update_seq=!0),"heartbeat"in e&&e.heartbeat&&(r.heartbeat=e.heartbeat),e.filter&&"string"==typeof e.filter&&(r.filter=e.filter),e.view&&"string"==typeof e.view&&(r.filter="_view",r.view=e.view),e.query_params&&"object"==typeof e.query_params)for(var u in e.query_params)
/* istanbul ignore else */
e.query_params.hasOwnProperty(u)&&(r[u]=e.query_params[u]);var c,f="GET";e.doc_ids?(
// set this automagically for the user; it's annoying that couchdb
// requires both a "filter" and a "doc_ids" param.
r.filter="_doc_ids",f="POST",c={doc_ids:e.doc_ids}):e.selector&&(
// set this automagically for the user, similar to above
r.filter="_selector",f="POST",c={selector:e.selector});var h,p=new Ze,v=function(n,s){if(!e.aborted){r.since=n,
// "since" can be any kind of json object in Cloudant/CouchDB 2.x
/* istanbul ignore next */
"object"==typeof r.since&&(r.since=JSON.stringify(r.since)),e.descending?i&&(r.limit=a):r.limit=!i||a>t?t:a;
// Set the options for the ajax call
var u=yn(o,"_changes"+_n(r)),v={signal:p.signal,method:f,body:JSON.stringify(c)};h=n,
/* istanbul ignore if */
e.aborted||
// Get the changes
d().then((function(){return l(u,v,s)})).catch(s)}},y={results:[]},g=function(n,r){if(!e.aborted){var o=0;
// If the result of the ajax call (res) contains changes (res.results)
if(r&&r.results){o=r.results.length,y.last_seq=r.last_seq;var u=null,c=null;
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */"number"==typeof r.pending&&(u=r.pending),"string"!=typeof y.last_seq&&"number"!=typeof y.last_seq||(c=y.last_seq),e.query_params,r.results=r.results.filter((function(t){a--;var n=Z(e)(t);return n&&(e.include_docs&&e.attachments&&e.binary&&hn(t),e.return_docs&&y.results.push(t),e.onChange(t,u,c)),n}))}else if(n)
// In case of an error, stop listening for changes and call
// opts.complete
return e.aborted=!0,void e.complete(n);
// The changes feed may have timed out with no results
// if so reuse last update sequence
r&&r.last_seq&&(h=r.last_seq);var f=i&&a<=0||r&&o<t||e.descending;(!e.continuous||i&&a<=0)&&f?
// We're done, call the callback
e.complete(null,y):
// Queue a call to fetch again with the newest sequence number
s((function(){v(h,g)}))}};
// Return a method to cancel this method from processing any more
return v(e.since||0,g),{cancel:function(){e.aborted=!0,p.abort()}}},
// Given a set of document/revision IDs (given by req), tets the subset of
// those that do NOT correspond to revisions stored in the database.
// See http://wiki.apache.org/couchdb/HttpPostRevsDiff
r.revsDiff=c("revsDiff",(function(e,t,n){
// If no options were given, set the callback to be the second parameter
"function"==typeof t&&(n=t,t={}),
// Get the missing document/revision IDs
l(yn(o,"_revs_diff"),{method:"POST",body:JSON.stringify(e)},n).catch(n)})),r._close=function(e){e()},r._destroy=function(e,t){l(yn(o,""),{method:"DELETE"}).then((function(e){t(null,e)})).catch((function(e){
/* istanbul ignore if */
404===e.status?t(null,{ok:!0}):t(e)}))}}
// HttpPouch is a valid adapter.
function bn(e){this.status=400,this.name="query_parse_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,bn)}catch(e){}}function wn(e){this.status=404,this.name="not_found",this.message=e,this.error=!0;try{Error.captureStackTrace(this,wn)}catch(e){}}function kn(e){this.status=500,this.name="invalid_value",this.message=e,this.error=!0;try{Error.captureStackTrace(this,kn)}catch(e){}}function jn(e,t){return t&&e.then((function(e){s((function(){t(null,e)}))}),(function(e){s((function(){t(e)}))})),e}function On(e,t){return function(){var n=arguments,r=this;return e.add((function(){return t.apply(r,n)}))}}
// uniq an array of strings, order not guaranteed
// similar to underscore/lodash _.uniq
function An(e){var t=new o(e),n=new Array(t.size),r=-1;return t.forEach((function(e){n[++r]=e})),n}function qn(e){var t=new Array(e.size),n=-1;return e.forEach((function(e,r){t[++n]=r})),t}function Sn(e){return new kn("builtin "+e+" function requires map values to be numbers or number arrays")}function xn(e){for(var t=0,n=0,r=e.length;n<r;n++){var o=e[n];if("number"!=typeof o){if(!Array.isArray(o))// not array/number
throw Sn("_sum");
// lists of numbers are also allowed, sum them separately
t="number"==typeof t?[t]:t;for(var i=0,s=o.length;i<s;i++){var a=o[i];if("number"!=typeof a)throw Sn("_sum");void 0===t[i]?t.push(a):t[i]+=a}}else"number"==typeof t?t+=o:// add number to array
t[0]+=o}return t}mn.valid=function(){return!0},l(bn,Error),l(wn,Error),l(kn,Error);var En=P.bind(null,"log"),Cn=Array.isArray,Pn=JSON.parse;function Ln(e,t){return fe("return ("+e.replace(/;\s*$/,"")+");",{emit:t,sum:xn,log:En,isArray:Cn,toJSON:Pn})}
/*
 * Simple task queue to sequentialize actions. Assumes
 * callbacks will eventually fire (once).
 */function Dn(){this.promise=new Promise((function(e){e()}))}function $n(e){if(!e)return"undefined";// backwards compat for empty reduce
// for backwards compat with mapreduce, functions/strings are stringified
// as-is. everything else is JSON-stringified.
switch(typeof e){case"function":case"string":
// e.g. a mapreduce built-in _reduce function
return e.toString();default:
// e.g. a JSON object in the case of mango queries
return JSON.stringify(e)}}
/* create a string signature for a view so we can cache it and uniq it */function In(e,t,n,r,o,i){var s,a=function(e,t){
// the "undefined" part is for backwards compatibility
return $n(e)+$n(t)+"undefined"}(n,r);if(!o&&
// cache this to ensure we don't try to update the same view twice
(s=e._cachedViews=e._cachedViews||{})[a])return s[a];var u=e.info().then((function(u){var c=u.db_name+"-mrview-"+(o?"temp":Ae(a));
// save the view name in the source db so it can be cleaned up if necessary
// (e.g. when the _design doc is deleted, remove all associated view data)
return le(e,"_local/"+i,(function(e){e.views=e.views||{};var n=t;-1===n.indexOf("/")&&(n=t+"/"+t);var r=e.views[n]=e.views[n]||{};
/* istanbul ignore if */if(!r[c])return r[c]=!0,e})).then((function(){return e.registerDependentDatabase(c).then((function(t){var o=t.db;o.auto_compaction=!0;var i={name:c,db:o,sourceDB:e,adapter:e.adapter,mapFun:n,reduceFun:r};return i.db.get("_local/lastSeq").catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e})).then((function(e){return i.seq=e?e.seq:0,s&&i.db.once("destroyed",(function(){delete s[a]})),i}))}))}))}));return s&&(s[a]=u),u}Dn.prototype.add=function(e){return this.promise=this.promise.catch((function(){
// just recover
})).then((function(){return e()})),this.promise},Dn.prototype.finish=function(){return this.promise};var Tn={},Bn=new Dn;function Mn(e){
// can be either 'ddocname/viewname' or just 'viewname'
// (where the ddoc name is the same)
return-1===e.indexOf("/")?[e,e]:e.split("/")}function Rn(e,t){try{e.emit("error",t)}catch(e){P("error","The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."),P("error",t)
/**
 * Returns an "abstract" mapreduce object of the form:
 *
 *   {
 *     query: queryFun,
 *     viewCleanup: viewCleanupFun
 *   }
 *
 * Arguments are:
 *
 * localDoc: string
 *   This is for the local doc that gets saved in order to track the
 *   "dependent" DBs and clean them up for viewCleanup. It should be
 *   unique, so that indexer plugins don't collide with each other.
 * mapper: function (mapFunDef, emit)
 *   Returns a map function based on the mapFunDef, which in the case of
 *   normal map/reduce is just the de-stringified function, but may be
 *   something else, such as an object in the case of pouchdb-find.
 * reducer: function (reduceFunDef)
 *   Ditto, but for reducing. Modules don't have to support reducing
 *   (e.g. pouchdb-find).
 * ddocValidator: function (ddoc, viewName)
 *   Throws an error if the ddoc or viewName is not valid.
 *   This could be a way to communicate to the user that the configuration for the
 *   indexer is invalid.
 */}}var Un=function(e,t){return xn(t)},Nn=function(e,t){return t.length},Fn=function(e,t){return{sum:xn(t),min:Math.min.apply(null,t),max:Math.max.apply(null,t),count:t.length,sumsqr:
// no need to implement rereduce=true, because Pouch
// will never call it
function(e){for(var t=0,n=0,r=e.length;n<r;n++){var o=e[n];t+=o*o}return t}(t)}},Kn=function(e,t,n,r){function a(e,t,n){
// emit an event if there was an error thrown by a map function.
// putting try/catches in a single function also avoids deoptimizations.
try{t(n)}catch(t){Rn(e,t)}}function u(e,t,n,r,o){
// same as above, but returning the result or an error. there are two separate
// functions to avoid extra memory allocations since the tryCode() case is used
// for custom map functions (common) vs this function, which is only used for
// custom reduce functions (rare)
try{return{output:t(n,r,o)}}catch(t){return Rn(e,t),{error:t}}}function c(e,t){var n=dt(e.key,t.key);return 0!==n?n:dt(e.value,t.value)}function l(e,t,n){return n=n||0,"number"==typeof t?e.slice(n,t+n):n>0?e.slice(n):e}function d(e){var t=e.value;
// Users can explicitly specify a joined doc _id, or it
// defaults to the doc _id that emitted the key/value.
return t&&"object"==typeof t&&t._id||e.id}function h(e){return function(t){return e.include_docs&&e.attachments&&e.binary&&function(e){e.rows.forEach((function(e){var t=e.doc&&e.doc._attachments;t&&Object.keys(t).forEach((function(e){var n=t[e];t[e].data=ge(n.data,n.content_type)}))}))}(t),t}}function p(e,t,n,r){
// add an http param from opts to params, optionally json-encoded
var o=t[e];void 0!==o&&(r&&(o=encodeURIComponent(JSON.stringify(o))),n.push(e+"="+o))}function v(e){if(void 0!==e){var t=Number(e);
// prevents e.g. '1foo' or '1.1' being coerced to 1
return isNaN(t)||t!==parseInt(e,10)?e:t}}function y(e,t){var n=e.descending?"endkey":"startkey",r=e.descending?"startkey":"endkey";if(void 0!==e[n]&&void 0!==e[r]&&dt(e[n],e[r])>0)throw new bn("No rows can match your key range, reverse your start_key and end_key or set {descending : true}");if(t.reduce&&!1!==e.reduce){if(e.include_docs)throw new bn("{include_docs:true} is invalid for reduce");if(e.keys&&e.keys.length>1&&!e.group&&!e.group_level)throw new bn("Multi-key fetches for reduce views must use {group: true}")}["group_level","limit","skip"].forEach((function(t){var n=function(e){if(e){if("number"!=typeof e)return new bn('Invalid value for integer: "'+e+'"');if(e<0)return new bn('Invalid value for positive integer: "'+e+'"')}}(e[t]);if(n)throw n}))}function g(e){return function(t){
/* istanbul ignore else */
if(404===t.status)return e;throw t}}
// returns a promise for a list of docs to update, based on the input docId.
// the order doesn't matter, because post-3.2.0, bulkDocs
// is an atomic operation in all three adapters.
function _(e,t,n){var r="_local/doc_"+e,i={_id:r,keys:[]},s=n.get(e),a=s[0];return(function(e){
// only return true if the current change is 1-
// and there are no other leafs
return 1===e.length&&/^1-/.test(e[0].rev)}(s[1])?Promise.resolve(i):t.db.get(r).catch(g(i))).then((function(e){return function(e){return e.keys.length?t.db.allDocs({keys:e.keys,include_docs:!0}):Promise.resolve({rows:[]})}(e).then((function(t){return function(e,t){for(var n=[],r=new o,i=0,s=t.rows.length;i<s;i++){var u=t.rows[i].doc;if(u&&(n.push(u),r.add(u._id),u._deleted=!a.has(u._id),!u._deleted)){var c=a.get(u._id);"value"in c&&(u.value=c.value)}}var f=qn(a);return f.forEach((function(e){if(!r.has(e)){
// new doc
var t={_id:e},o=a.get(e);"value"in o&&(t.value=o.value),n.push(t)}})),e.keys=An(f.concat(e.keys)),n.push(e),n}(e,t)}))}))}
// updates all emitted key/value docs and metaDocs in the mrview database
// for the given batch of documents from the source database
function m(e){var t="string"==typeof e?e:e.name,n=Tn[t];return n||(n=Tn[t]=new Dn),n}function b(e){return On(m(e),(function(){return function(e){
// bind the emit function once
var t,n;var r=function(e,t){
// for temp_views one can use emit(doc, emit), see #38
if("function"==typeof e&&2===e.length){var n=e;return function(e){return n(e,t)}}return Ln(e.toString(),t)}(e.mapFun,(function(e,r){var o={id:n._id,key:ht(e)};
// Don't explicitly store the value unless it's defined and non-null.
// This saves on storage space, because often people don't use it.
null!=r&&(o.value=ht(r)),t.push(o)})),o=e.seq||0;function s(t,n){return function(){return function(e,t,n){var r="_local/lastSeq";return e.db.get(r).catch(g({_id:r,seq:0})).then((function(r){var o=qn(t);return Promise.all(o.map((function(n){return _(n,e,t)}))).then((function(t){var o=ee(t);
// write all docs in a single operation, update the seq once
return r.seq=n,o.push(r),e.db.bulkDocs({docs:o})}))}))}(e,t,n)}}var u=new Dn;function f(){return e.sourceDB.changes({return_docs:!0,conflicts:!0,include_docs:!0,style:"all_docs",since:o,limit:50}).then(l)}function l(e){var t=e.results;if(t.length){var n=d(t);if(u.add(s(n,o)),!(t.length<50))return f()}}function d(s){for(var u=new i,f=0,l=s.length;f<l;f++){var d=s[f];if("_"!==d.doc._id[0]){t=[],(n=d.doc)._deleted||a(e.sourceDB,r,n),t.sort(c);var p=h(t);u.set(d.doc._id,[p,d.changes])}o=d.seq}return u}function h(e){for(var t,n=new i,r=0,o=e.length;r<o;r++){var s=e[r],a=[s.key,s.id];r>0&&0===dt(s.key,t)&&a.push(r),n.set(pt(a),s),t=s.key}return n}return f().then((function(){return u.finish()})).then((function(){e.seq=o}))}(e)}))()}function w(e,t){return On(m(e),(function(){return function(e,t){var n,r=e.reduceFun&&!1!==t.reduce,o=t.skip||0;function s(t){return t.include_docs=!0,e.db.allDocs(t).then((function(e){return n=e.total_rows,e.rows.map((function(e){
// implicit migration - in older versions of PouchDB,
// we explicitly stored the doc as {id: ..., key: ..., value: ...}
// this is tested in a migration test
/* istanbul ignore next */
if("value"in e.doc&&"object"==typeof e.doc.value&&null!==e.doc.value){var t=Object.keys(e.doc.value).sort(),n=["id","key","value"];
// this detection method is not perfect, but it's unlikely the user
// emitted a value which was an object with these 3 exact keys
if(!(t<n||t>n))return e.doc.value}var r=function(e){
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
for(var t=[],n=[],r=0;;){var o=e[r++];if("\0"!==o)switch(o){case"1":t.push(null);break;case"2":t.push("1"===e[r]),r++;break;case"3":var i=vt(e,r);t.push(i.num),r+=i.length;break;case"4":
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
for(var s="";;){var a=e[r];if("\0"===a)break;s+=a,r++}
// perform the reverse of the order-preserving replacement
// algorithm (see above)
/* eslint-disable no-control-regex */s=s.replace(/\u0001\u0001/g,"\0").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,""),
/* eslint-enable no-control-regex */
t.push(s);break;case"5":var u={element:[],index:t.length};t.push(u.element),n.push(u);break;case"6":var c={element:{},index:t.length};t.push(c.element),n.push(c);break;
/* istanbul ignore next */default:throw new Error("bad collationIndex or unexpectedly reached end of input: "+o)}else{if(1===t.length)return t.pop();yt(t,n)}}}(e.doc._id);return{key:r[0],id:r[1],value:"value"in e.doc?e.doc.value:null}}))}))}function a(s){var a;if(a=r?function(e,t,n){0===n.group_level&&delete n.group_level;var r=n.group||n.group_level,o=function(e){var t=e.toString(),n=function(e){if(/^_sum/.test(e))return Un;if(/^_count/.test(e))return Nn;if(/^_stats/.test(e))return Fn;if(/^_/.test(e))throw new Error(e+" is not a supported reduce function.")}(t);return n||Ln(t)}(e.reduceFun),i=[],s=isNaN(n.group_level)?Number.POSITIVE_INFINITY:n.group_level;t.forEach((function(e){var t=i[i.length-1],n=r?e.key:null;if(
// only set group_level for array keys
r&&Array.isArray(n)&&(n=n.slice(0,s)),t&&0===dt(t.groupKey,n))return t.keys.push([e.key,e.id]),void t.values.push(e.value);i.push({keys:[[e.key,e.id]],values:[e.value],groupKey:n})})),t=[];for(var a=0,c=i.length;a<c;a++){var f=i[a],d=u(e.sourceDB,o,f.keys,f.values,!1);if(d.error&&d.error instanceof kn)
// CouchDB returns an error if a built-in errors out
throw d.error;t.push({
// CouchDB just sets the value to null if a non-built-in errors out
value:d.error?null:d.output,key:f.groupKey})}
// no total_rows/offset when reducing
return{rows:l(t,n.limit,n.skip)}}(e,s,t):{total_rows:n,offset:o,rows:s}
/* istanbul ignore if */,t.update_seq&&(a.update_seq=e.seq),t.include_docs){var c=An(s.map(d));return e.sourceDB.allDocs({keys:c,include_docs:!0,conflicts:t.conflicts,attachments:t.attachments,binary:t.binary}).then((function(e){var t=new i;return e.rows.forEach((function(e){t.set(e.id,e.doc)})),s.forEach((function(e){var n=d(e),r=t.get(n);r&&(e.doc=r)})),a}))}return a}if(void 0===t.keys||t.keys.length||(
// equivalent query
t.limit=0,delete t.keys),void 0!==t.keys){var c=t.keys.map((function(e){var n={startkey:pt([e]),endkey:pt([e,{}])};
/* istanbul ignore if */return t.update_seq&&(n.update_seq=!0),s(n)}));return Promise.all(c).then(ee).then(a)}// normal query, no 'keys'
var f,h,p={descending:t.descending};
/* istanbul ignore if */if(t.update_seq&&(p.update_seq=!0),"start_key"in t&&(f=t.start_key),"startkey"in t&&(f=t.startkey),"end_key"in t&&(h=t.end_key),"endkey"in t&&(h=t.endkey),void 0!==f&&(p.startkey=t.descending?pt([f,{}]):pt([f])),void 0!==h){var v=!1!==t.inclusive_end;t.descending&&(v=!v),p.endkey=pt(v?[h,{}]:[h])}if(void 0!==t.key){var y=pt([t.key]),g=pt([t.key,{}]);p.descending?(p.endkey=y,p.startkey=g):(p.startkey=y,p.endkey=g)}return r||("number"==typeof t.limit&&(p.limit=t.limit),p.skip=o),s(p).then(a)}(e,t)}))()}function k(t,n,r){
/* istanbul ignore next */
if("function"==typeof t._query)
// custom adapters can define their own api._query
// and override the default behavior
/* istanbul ignore next */
return function(e,t,n){return new Promise((function(r,o){e._query(t,n,(function(e,t){if(e)return o(e);r(t)}))}))}
// custom adapters can define their own api._viewCleanup
// and override the default behavior
/* istanbul ignore next */(t,n,r);if(ne(t))return function(e,t,n){
// List of parameters to add to the PUT request
var r,o,i,s=[],a="GET";
// If keys are supplied, issue a POST to circumvent GET query string limits
// see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
if(
// If opts.reduce exists and is defined, then add it to the list
// of parameters.
// If reduce=false then the results are that of only the map function
// not the final result of map and reduce.
p("reduce",n,s),p("include_docs",n,s),p("attachments",n,s),p("limit",n,s),p("descending",n,s),p("group",n,s),p("group_level",n,s),p("skip",n,s),p("stale",n,s),p("conflicts",n,s),p("startkey",n,s,!0),p("start_key",n,s,!0),p("endkey",n,s,!0),p("end_key",n,s,!0),p("inclusive_end",n,s),p("key",n,s,!0),p("update_seq",n,s),s=""===(
// Format the list of parameters into a valid URI query string
s=s.join("&"))?"":"?"+s,void 0!==n.keys){var u="keys="+encodeURIComponent(JSON.stringify(n.keys));
// according to http://stackoverflow.com/a/417184/680742,
// the de facto URL length limit is 2000 characters
u.length+s.length+1<=2e3?
// If the keys are short enough, do a GET. we do this to work around
// Safari not understanding 304s on POSTs (see pouchdb/pouchdb#1239)
s+=("?"===s[0]?"&":"?")+u:(a="POST","string"==typeof t?r={keys:n.keys}:// fun is {map : mapfun}, so append to this
t.keys=n.keys)}
// We are referencing a query defined in the design doc
if("string"==typeof t){var c=Mn(t);return e.fetch("_design/"+c[0]+"/_view/"+c[1]+s,{headers:new tt({"Content-Type":"application/json"}),method:a,body:JSON.stringify(r)}).then((function(e){return o=e.ok,i=e.status,e.json()})).then((function(e){if(!o)throw e.status=i,X(e);
// fail the entire request if the result contains an error
return e.rows.forEach((function(e){
/* istanbul ignore if */
if(e.value&&e.value.error&&"builtin_reduce_error"===e.value.error)throw new Error(e.reason)})),e})).then(h(n))}
// We are using a temporary view, terrible for performance, good for testing
return r=r||{},Object.keys(t).forEach((function(e){Array.isArray(t[e])?r[e]=t[e]:r[e]=t[e].toString()})),e.fetch("_temp_view"+s,{headers:new tt({"Content-Type":"application/json"}),method:"POST",body:JSON.stringify(r)}).then((function(e){return o=e.ok,i=e.status,e.json()})).then((function(e){if(!o)throw e.status=i,X(e);return e})).then(h(n))}(t,n,r);if("string"!=typeof n)
// temp_view
return y(r,n),Bn.add((function(){return In(
/* sourceDB */t,
/* viewName */"temp_view/temp_view",
/* mapFun */n.map,
/* reduceFun */n.reduce,
/* temporary */!0,
/* localDocName */e).then((function(e){return t=b(e).then((function(){return w(e,r)})),n=function(){return e.db.destroy()},t.then((function(e){return n().then((function(){return e}))}),(function(e){return n().then((function(){throw e}))}));
// Promise finally util similar to Q.finally
var t,n}))})),Bn.finish();
// persistent view
var o=n,i=Mn(o),a=i[0],u=i[1];return t.get("_design/"+a).then((function(n){var i=n.views&&n.views[u];if(!i)
// basic validator; it's assumed that every subclass would want this
throw new wn("ddoc "+n._id+" has no view named "+u);return function(e,t){var n=e.views&&e.views[t];if("string"!=typeof n.map)throw new wn("ddoc "+e._id+" has no string view named "+t+", instead found object of type: "+typeof n.map)}(n,u),y(r,i),In(
/* sourceDB */t,
/* viewName */o,
/* mapFun */i.map,
/* reduceFun */i.reduce,
/* temporary */!1,
/* localDocName */e).then((function(e){return"ok"===r.stale||"update_after"===r.stale?("update_after"===r.stale&&s((function(){b(e)})),w(e,r)):b(e).then((function(){return w(e,r)}))}))}))}var j;return{query:function(e,t,n){var r=this;"function"==typeof t&&(n=t,t={}),t=t?function(e){return e.group_level=v(e.group_level),e.limit=v(e.limit),e.skip=v(e.skip),e}(t):{},"function"==typeof e&&(e={map:e});var o=Promise.resolve().then((function(){return k(r,e,t)}));return jn(o,n),o},viewCleanup:(j=function(){var t=this;
/* istanbul ignore next */return"function"==typeof t._viewCleanup?function(e){return new Promise((function(t,n){e._viewCleanup((function(e,r){if(e)return n(e);t(r)}))}))}(t):ne(t)?function(e){return e.fetch("_view_cleanup",{headers:new tt({"Content-Type":"application/json"}),method:"POST"}).then((function(e){return e.json()}))}(t):function(t){return t.get("_local/"+e).then((function(e){var n=new i;Object.keys(e.views).forEach((function(e){var t=Mn(e),r="_design/"+t[0],i=t[1],s=n.get(r);s||(s=new o,n.set(r,s)),s.add(i)}));var r={keys:qn(n),include_docs:!0};return t.allDocs(r).then((function(r){var o={};r.rows.forEach((function(t){var r=t.key.substring(8);// cuts off '_design/'
n.get(t.key).forEach((function(n){var i=r+"/"+n;
/* istanbul ignore if */e.views[i]||(
// new format, without slashes, to support PouchDB 2.2.0
// migration test in pouchdb's browser.migration.js verifies this
i=n);var s=Object.keys(e.views[i]),a=t.doc&&t.doc.views&&t.doc.views[n];
// design doc deleted, or view function nonexistent
s.forEach((function(e){o[e]=o[e]||a}))}))}));var i=Object.keys(o).filter((function(e){return!o[e]})).map((function(e){return On(m(e),(function(){return new t.constructor(e,t.__opts).destroy()}))()}));return Promise.all(i).then((function(){return{ok:!0}}))}))}),g({ok:!0}))}(t)},f((function(e){var t=e.pop(),n=j.apply(this,e);return"function"==typeof t&&jn(n,t),n})))}}("mrviews"),Jn={query:function(e,t,n){return Kn.query.call(this,e,t,n)},viewCleanup:function(e){return Kn.viewCleanup.call(this,e)}};function zn(e){return/^1-/.test(e)}function Vn(e,t){var n=Object.keys(t._attachments);return Promise.all(n.map((function(n){return e.getAttachment(t._id,n,{rev:t._rev})})))}
// Fetch all the documents from the src as described in the "diffs",
// which is a mapping of docs IDs to revisions. If the state ever
// changes to "cancelled", then the returned promise will be rejected.
// Else it will be resolved with a list of fetched documents.
var Gn="pouchdb";function Qn(e,t,n,r,o){return e.get(t).catch((function(n){if(404===n.status)return"http"!==e.adapter&&"https"!==e.adapter||D(404,"PouchDB is just checking if a remote checkpoint exists."),{session_id:r,_id:t,history:[],replicator:Gn,version:1};throw n})).then((function(i){if(!o.cancelled&&i.last_seq!==n)
// Filter out current entry for this replication
return i.history=(i.history||[]).filter((function(e){return e.session_id!==r})),
// Add the latest checkpoint to history
i.history.unshift({last_seq:n,session_id:r}),
// Just take the last pieces in history, to
// avoid really big checkpoint docs.
// see comment on history size above
i.history=i.history.slice(0,5),i.version=1,i.replicator=Gn,i.session_id=r,i.last_seq=n,e.put(i).catch((function(i){if(409===i.status)
// retry; someone is trying to write a checkpoint simultaneously
return Qn(e,t,n,r,o);throw i}));
// if the checkpoint has not changed, do not update
}))}function Wn(e,t,n,r,o){this.src=e,this.target=t,this.id=n,this.returnValue=r,this.opts=o||{}}Wn.prototype.writeCheckpoint=function(e,t){var n=this;return this.updateTarget(e,t).then((function(){return n.updateSource(e,t)}))},Wn.prototype.updateTarget=function(e,t){return this.opts.writeTargetCheckpoint?Qn(this.target,this.id,e,t,this.returnValue):Promise.resolve(!0)},Wn.prototype.updateSource=function(e,t){if(this.opts.writeSourceCheckpoint){var n=this;return Qn(this.src,this.id,e,t,this.returnValue).catch((function(e){if(Zn(e))return n.opts.writeSourceCheckpoint=!1,!0;throw e}))}return Promise.resolve(!0)};var Yn={undefined:function(e,t){
// This is the previous comparison function
return 0===dt(e.last_seq,t.last_seq)?t.last_seq:0
/* istanbul ignore next */},1:function(e,t){
// This is the comparison function ported from CouchDB
// This checkpoint comparison is ported from CouchDBs source
// they come from here:
// https://github.com/apache/couchdb-couch-replicator/blob/master/src/couch_replicator.erl#L863-L906
return function(e,t){return e.session_id===t.session_id?{last_seq:e.last_seq,history:e.history}:Hn(e.history,t.history)}(t,e).last_seq}};function Hn(e,t){
// the erlang loop via function arguments is not so easy to repeat in JS
// therefore, doing this as recursion
var n=e[0],r=e.slice(1),o=t[0],i=t.slice(1);return n&&0!==t.length?
/* istanbul ignore if */
Xn(n.session_id,t)?{last_seq:n.last_seq,history:e}:Xn(o.session_id,r)?{last_seq:o.last_seq,history:i}:Hn(r,i):{last_seq:0,history:[]}}function Xn(e,t){var n=t[0],r=t.slice(1);return!(!e||0===t.length)&&(e===n.session_id||Xn(e,r))}function Zn(e){return"number"==typeof e.status&&4===Math.floor(e.status/100)}function er(e,t,n,r,o){var i,a,u,c=[],f={seq:0,changes:[],docs:[]},l=!1,d=!1,h=!1,p=0,v=n.continuous||n.live||!1,y=n.batch_size||100,g=n.batches_limit||10,_=!1,m=n.doc_ids,b=n.selector,k=[],j=Se();// list of batches to be processed
o=o||{ok:!0,start_time:(new Date).toISOString(),docs_read:0,docs_written:0,doc_write_failures:0,errors:[]};var O={};function A(){return u?Promise.resolve():
// Generate a unique id particular to this replication.
// Not guaranteed to align perfectly with CouchDB's rep ids.
function(e,t,n){var r=n.doc_ids?n.doc_ids.sort(dt):"",o=n.filter?n.filter.toString():"",i="",s="",a="";
// possibility for checkpoints to be lost here as behaviour of
// JSON.stringify is not stable (see #6226)
/* istanbul ignore if */return n.selector&&(a=JSON.stringify(n.selector)),n.filter&&n.query_params&&(i=JSON.stringify(function(e){return Object.keys(e).sort(dt).reduce((function(t,n){return t[n]=e[n],t}),{})}(n.query_params))),n.filter&&"_view"===n.filter&&(s=n.view.toString()),Promise.all([e.id(),t.id()]).then((function(e){var t=e[0]+e[1]+o+s+i+r+a;return new Promise((function(e){Oe(t,e)}))})).then((function(e){return"_local/"+e.replace(/\//g,".").replace(/\+/g,"_")}))}(e,t,n).then((function(o){a=o;var i;i=!1===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!1}:"source"===n.checkpoint?{writeSourceCheckpoint:!0,writeTargetCheckpoint:!1}:"target"===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!0}:{writeSourceCheckpoint:!0,writeTargetCheckpoint:!0},u=new Wn(e,t,a,r,i)}))}function q(){if(k=[],0!==i.docs.length){var e=i.docs,s={timeout:n.timeout};return t.bulkDocs({docs:e,new_edits:!1},s).then((function(t){
/* istanbul ignore if */
if(r.cancelled)throw D(),new Error("cancelled");
// `res` doesn't include full documents (which live in `docs`), so we create a map of 
// (id -> error), and check for errors while iterating over `docs`
var n=Object.create(null);t.forEach((function(e){e.error&&(n[e.id]=e)}));var i=Object.keys(n).length;o.doc_write_failures+=i,o.docs_written+=e.length-i,e.forEach((function(e){var t=n[e._id];if(t){o.errors.push(t);
// Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
var i=(t.name||"").toLowerCase();if("unauthorized"!==i&&"forbidden"!==i)throw t;r.emit("denied",w(t))}else k.push(e)}))}),(function(t){throw o.doc_write_failures+=e.length,t}))}}function S(){if(i.error)throw new Error("There was a problem getting docs.");o.last_seq=p=i.seq;var e=w(o);return k.length&&(e.docs=k,
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */
"number"==typeof i.pending&&(e.pending=i.pending,delete i.pending),r.emit("change",e)),l=!0,u.writeCheckpoint(i.seq,j).then((function(){
/* istanbul ignore if */
if(l=!1,r.cancelled)throw D(),new Error("cancelled");i=void 0,B()})).catch((function(e){throw R(e),e}))}function x(){return function(e,t,n,r){n=w(n);// we do not need to modify this
var o=[],i=!0;function s(t){
// Optimization: fetch gen-1 docs and attachments in
// a single request using _all_docs
return e.allDocs({keys:t,include_docs:!0,conflicts:!0}).then((function(e){if(r.cancelled)throw new Error("cancelled");e.rows.forEach((function(e){var t;e.deleted||!e.doc||!zn(e.value.rev)||(t=e.doc)._attachments&&Object.keys(t._attachments).length>0||function(e){return e._conflicts&&e._conflicts.length>0}(e.doc)||(
// strip _conflicts array to appease CSG (#5793)
/* istanbul ignore if */
e.doc._conflicts&&delete e.doc._conflicts,
// the doc we got back from allDocs() is sufficient
o.push(e.doc),delete n[e.id])}))}))}return Promise.resolve().then((function(){
// filter out the generation 1 docs and get them
// leaving the non-generation one docs to be got otherwise
var e=Object.keys(n).filter((function(e){var t=n[e].missing;return 1===t.length&&zn(t[0])}));if(e.length>0)return s(e)})).then((function(){var s=function(e){var t=[];return Object.keys(e).forEach((function(n){e[n].missing.forEach((function(e){t.push({id:n,rev:e})}))})),{docs:t,revs:!0,latest:!0}}(n);if(s.docs.length)return e.bulkGet(s).then((function(n){
/* istanbul ignore if */
if(r.cancelled)throw new Error("cancelled");return Promise.all(n.results.map((function(n){return Promise.all(n.docs.map((function(n){var r=n.ok;return n.error&&(
// when AUTO_COMPACTION is set, docs can be returned which look
// like this: {"missing":"1-7c3ac256b693c462af8442f992b83696"}
i=!1),r&&r._attachments?function(e,t,n){var r=ne(t)&&!ne(e),o=Object.keys(n._attachments);return r?e.get(n._id).then((function(r){return Promise.all(o.map((function(o){return function(e,t,n){return!e._attachments||!e._attachments[n]||e._attachments[n].digest!==t._attachments[n].digest}(r,n,o)?t.getAttachment(n._id,o):e.getAttachment(r._id,o)})))})).catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e;return Vn(t,n)})):Vn(t,n)}(t,e,r).then((function(e){var t=Object.keys(r._attachments);return e.forEach((function(e,n){var o=r._attachments[t[n]];delete o.stub,delete o.length,o.data=e})),r})):r})))}))).then((function(e){o=o.concat(ee(e).filter(Boolean))}))}))})).then((function(){return{ok:i,docs:o}}))}(e,t,i.diffs,r).then((function(e){i.error=!e.ok,e.docs.forEach((function(e){delete i.diffs[e._id],o.docs_read++,i.docs.push(e)}))}))}function E(){var e;r.cancelled||i||(0!==c.length?(i=c.shift(),(e={},i.changes.forEach((function(t){
// Couchbase Sync Gateway emits these, but we can ignore them
/* istanbul ignore if */
"_user/"!==t.id&&(e[t.id]=t.changes.map((function(e){return e.rev})))})),t.revsDiff(e).then((function(e){
/* istanbul ignore if */
if(r.cancelled)throw D(),new Error("cancelled");
// currentBatch.diffs elements are deleted as the documents are written
i.diffs=e}))).then(x).then(q).then(S).then(E).catch((function(e){P("batch processing terminated with error",e)}))):C(!0))}function C(e){0!==f.changes.length?(e||d||f.changes.length>=y)&&(c.push(f),f={seq:0,changes:[],docs:[]},"pending"!==r.state&&"stopped"!==r.state||(r.state="active",r.emit("active")),E()):0!==c.length||i||((v&&O.live||d)&&(r.state="pending",r.emit("paused")),d&&D())}function P(e,t){h||(t.message||(t.message=e),o.ok=!1,o.status="aborting",c=[],f={seq:0,changes:[],docs:[]},D(t))}function D(i){if(!(h||r.cancelled&&(o.status="cancelled",l)))if(o.status=o.status||"complete",o.end_time=(new Date).toISOString(),o.last_seq=p,h=!0,i){
// need to extend the error because Firefox considers ".result" read-only
(i=H(i)).result=o;
// Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
var s=(i.name||"").toLowerCase();"unauthorized"===s||"forbidden"===s?(r.emit("error",i),r.removeAllListeners()):function(e,t,n,r){if(!1===e.retry)return t.emit("error",n),void t.removeAllListeners();
/* istanbul ignore if */if("function"!=typeof e.back_off_function&&(e.back_off_function=L),t.emit("requestError",n),"active"===t.state||"pending"===t.state){t.emit("paused",n),t.state="stopped";var o=function(){e.current_back_off=0};t.once("paused",(function(){t.removeListener("active",o)})),t.once("active",o)}e.current_back_off=e.current_back_off||0,e.current_back_off=e.back_off_function(e.current_back_off),setTimeout(r,e.current_back_off)}(n,r,i,(function(){er(e,t,n,r)}))}else r.emit("complete",o),r.removeAllListeners();
/* istanbul ignore if */}function $(e,t,o){
/* istanbul ignore if */
if(r.cancelled)return D();
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */"number"==typeof t&&(f.pending=t),Z(n)(e)&&(f.seq=e.seq||o,f.changes.push(e),s((function(){C(0===c.length&&O.live)})))}function I(e){
/* istanbul ignore if */
if(_=!1,r.cancelled)return D();
// if no results were returned then we're done,
// else fetch more
if(e.results.length>0)O.since=e.results[e.results.length-1].seq,B(),C(!0);else{var t=function(){v?(O.live=!0,B()):d=!0,C(!0)};
// update the checkpoint so we start from the right seq next time
i||0!==e.results.length?t():(l=!0,u.writeCheckpoint(e.last_seq,j).then((function(){l=!1,o.last_seq=p=e.last_seq,t()})).catch(R))}}function T(e){
/* istanbul ignore if */
if(_=!1,r.cancelled)return D();P("changes rejected",e)}function B(){if(!_&&!d&&c.length<g){_=!0,r._changes&&(// remove old changes() and listeners
r.removeListener("cancel",r._abortChanges),r._changes.cancel()),r.once("cancel",o);var t=e.changes(O).on("change",$);t.then(i,i),t.then(I).catch(T),n.retry&&(
// save for later so we can cancel if necessary
r._changes=t,r._abortChanges=o)}function o(){t.cancel()}function i(){r.removeListener("cancel",o)}}function M(){A().then((function(){
/* istanbul ignore if */
if(!r.cancelled)return u.getCheckpoint().then((function(e){O={since:p=e,limit:y,batch_size:y,style:"all_docs",doc_ids:m,selector:b,return_docs:!0},n.filter&&("string"!=typeof n.filter?
// required for the client-side filter in onChange
O.include_docs=!0:// ddoc filter
O.filter=n.filter),"heartbeat"in n&&(O.heartbeat=n.heartbeat),"timeout"in n&&(O.timeout=n.timeout),n.query_params&&(O.query_params=n.query_params),n.view&&(O.view=n.view),B()}));D()})).catch((function(e){P("getCheckpoint rejected with ",e)}))}
/* istanbul ignore next */function R(e){l=!1,P("writeCheckpoint completed with error",e)}
/* istanbul ignore if */r.ready(e,t),r.cancelled?// cancelled immediately
D():(r._addedListeners||(r.once("cancel",D),"function"==typeof n.complete&&(r.once("error",n.complete),r.once("complete",(function(e){n.complete(null,e)}))),r._addedListeners=!0),void 0===n.since?M():A().then((function(){return l=!0,u.writeCheckpoint(n.since,j)})).then((function(){l=!1,
/* istanbul ignore if */
r.cancelled?D():(p=n.since,M())})).catch(R))}
// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
function tr(){d.call(this),this.cancelled=!1,this.state="pending";var e=this,t=new Promise((function(t,n){e.once("complete",t),e.once("error",n)}));e.then=function(e,n){return t.then(e,n)},e.catch=function(e){return t.catch(e)},
// As we allow error handling via "error" event as well,
// put a stub in here so that rejecting never throws UnhandledError.
e.catch((function(){}))}function nr(e,t){var n=t.PouchConstructor;return"string"==typeof e?new n(e,t):e}function rr(e,t,n,r){if("function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),n.doc_ids&&!Array.isArray(n.doc_ids))throw H(V,"`doc_ids` filter parameter is not a list.");n.complete=r,(n=w(n)).continuous=n.continuous||n.live,n.retry="retry"in n&&n.retry,
/*jshint validthis:true */
n.PouchConstructor=n.PouchConstructor||this;var o=new tr(n);return er(nr(e,n),nr(t,n),n,o),o}function or(e,t,n,r){return"function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),
/*jshint validthis:true */
(n=w(n)).PouchConstructor=n.PouchConstructor||this,new ir(e=nr(e,n),t=nr(t,n),n,r)}function ir(e,t,n,r){var o=this;this.canceled=!1;var i=n.push?$({},n,n.push):n,s=n.pull?$({},n,n.pull):n;function a(e){o.emit("change",{direction:"pull",change:e})}function u(e){o.emit("change",{direction:"push",change:e})}function c(e){o.emit("denied",{direction:"push",doc:e})}function f(e){o.emit("denied",{direction:"pull",doc:e})}function l(){o.pushPaused=!0,
/* istanbul ignore if */
o.pullPaused&&o.emit("paused")}function d(){o.pullPaused=!0,
/* istanbul ignore if */
o.pushPaused&&o.emit("paused")}function h(){o.pushPaused=!1,
/* istanbul ignore if */
o.pullPaused&&o.emit("active",{direction:"push"})}function p(){o.pullPaused=!1,
/* istanbul ignore if */
o.pushPaused&&o.emit("active",{direction:"pull"})}this.push=rr(e,t,i),this.pull=rr(t,e,s),this.pushPaused=!0,this.pullPaused=!0;var v={};function y(e){// type is 'push' or 'pull'
return function(t,n){("change"===t&&(n===a||n===u)||"denied"===t&&(n===f||n===c)||"paused"===t&&(n===d||n===l)||"active"===t&&(n===p||n===h))&&(t in v||(v[t]={}),v[t][e]=!0,2===Object.keys(v[t]).length&&
// both push and pull have asked to be removed
o.removeAllListeners(t))}}function g(e,t,n){-1==e.listeners(t).indexOf(n)&&e.on(t,n)}n.live&&(this.push.on("complete",o.pull.cancel.bind(o.pull)),this.pull.on("complete",o.push.cancel.bind(o.push))),this.on("newListener",(function(e){"change"===e?(g(o.pull,"change",a),g(o.push,"change",u)):"denied"===e?(g(o.pull,"denied",f),g(o.push,"denied",c)):"active"===e?(g(o.pull,"active",p),g(o.push,"active",h)):"paused"===e&&(g(o.pull,"paused",d),g(o.push,"paused",l))})),this.on("removeListener",(function(e){"change"===e?(o.pull.removeListener("change",a),o.push.removeListener("change",u)):"denied"===e?(o.pull.removeListener("denied",f),o.push.removeListener("denied",c)):"active"===e?(o.pull.removeListener("active",p),o.push.removeListener("active",h)):"paused"===e&&(o.pull.removeListener("paused",d),o.push.removeListener("paused",l))})),this.pull.on("removeListener",y("pull")),this.push.on("removeListener",y("push"));var _=Promise.all([this.push,this.pull]).then((function(e){var t={push:e[0],pull:e[1]};return o.emit("complete",t),r&&r(null,t),o.removeAllListeners(),t}),(function(e){if(o.cancel(),r?
// if there's a callback, then the callback can receive
// the error event
r(e):
// if there's no callback, then we're safe to emit an error
// event, which would otherwise throw an unhandled error
// due to 'error' being a special event in EventEmitters
o.emit("error",e),o.removeAllListeners(),r)
// no sense throwing if we're already emitting an 'error' event
throw e}));this.then=function(e,t){return _.then(e,t)},this.catch=function(e){return _.catch(e)}}Wn.prototype.getCheckpoint=function(){var e=this;return e.opts&&e.opts.writeSourceCheckpoint&&!e.opts.writeTargetCheckpoint?e.src.get(e.id).then((function(e){return e.last_seq||0})).catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e;return 0})):e.target.get(e.id).then((function(t){return e.opts&&e.opts.writeTargetCheckpoint&&!e.opts.writeSourceCheckpoint?t.last_seq||0:e.src.get(e.id).then((function(e){
// Since we can't migrate an old version doc to a new one
// (no session id), we just go with the lowest seq in this case
/* istanbul ignore if */
return t.version!==e.version?0:(n=t.version?t.version.toString():"undefined")in Yn?Yn[n](t,e):0
/* istanbul ignore next */;var n}),(function(n){if(404===n.status&&t.last_seq)return e.src.put({_id:e.id,last_seq:0}).then((function(){return 0}),(function(n){return Zn(n)?(e.opts.writeSourceCheckpoint=!1,t.last_seq):0
/* istanbul ignore next */}));throw n}))})).catch((function(e){if(404!==e.status)throw e;return 0}))},l(tr,d),tr.prototype.cancel=function(){this.cancelled=!0,this.state="cancelled",this.emit("cancel")},tr.prototype.ready=function(e,t){var n=this;function r(){n.cancel()}n._readyCalled||(n._readyCalled=!0,e.once("destroyed",r),t.once("destroyed",r),n.once("complete",(function(){e.removeListener("destroyed",r),t.removeListener("destroyed",r)})))},l(ir,d),ir.prototype.cancel=function(){this.canceled||(this.canceled=!0,this.push.cancel(),this.pull.cancel())},Xe.plugin((function(e){e.adapter("idb",fn,!0)})).plugin((function(e){e.adapter("http",mn,!1),e.adapter("https",mn,!1)})).plugin(Jn).plugin((function(e){e.replicate=rr,e.sync=or,Object.defineProperty(e.prototype,"replicate",{get:function(){var e=this;return void 0===this.replicateMethods&&(this.replicateMethods={from:function(t,n,r){return e.constructor.replicate(t,e,n,r)},to:function(t,n,r){return e.constructor.replicate(e,t,n,r)}}),this.replicateMethods}}),e.prototype.sync=function(e,t,n){return this.constructor.sync(this,e,t,n)}})),t.exports=Xe}).call(this)}).call(this,e("_process"))},{_process:12,argsarray:1,events:3,immediate:4,inherits:10,"spark-md5":13,uuid:15,vuvuzela:24}],12:[function(e,t,n){
// shim for using process in browser
var r,o,i=t.exports={};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
function s(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function u(e){if(r===setTimeout)
//normal enviroments in sane situations
return setTimeout(e,0);
// if setTimeout wasn't available but was latter defined
if((r===s||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{
// when when somebody has screwed with setTimeout but no I.E. maddness
return r(e,0)}catch(t){try{
// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
return r.call(null,e,0)}catch(t){
// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:s}catch(e){r=s}try{o="function"==typeof clearTimeout?clearTimeout:a}catch(e){o=a}}();var c,f=[],l=!1,d=-1;function h(){l&&c&&(l=!1,c.length?f=c.concat(f):d=-1,f.length&&p())}function p(){if(!l){var e=u(h);l=!0;for(var t=f.length;t;){for(c=f,f=[];++d<t;)c&&c[d].run();d=-1,t=f.length}c=null,l=!1,function(e){if(o===clearTimeout)
//normal enviroments in sane situations
return clearTimeout(e);
// if clearTimeout wasn't available but was latter defined
if((o===a||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{
// when when somebody has screwed with setTimeout but no I.E. maddness
o(e)}catch(t){try{
// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
return o.call(null,e)}catch(t){
// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
// Some versions of I.E. have different rules for clearTimeout vs setTimeout
return o.call(this,e)}}}(e)}}
// v8 likes predictible objects
function v(e,t){this.fun=e,this.array=t}function y(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];f.push(new v(e,t)),1!==f.length||l||u(p)},v.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",// empty string to avoid regexp issues
i.versions={},i.on=y,i.addListener=y,i.once=y,i.off=y,i.removeListener=y,i.removeAllListeners=y,i.emit=y,i.prependListener=y,i.prependOnceListener=y,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],13:[function(e,t,n){!function(e){if("object"==typeof n)
// Node/CommonJS
t.exports=e();else{
// Browser globals (with support for web workers)
var r;try{r=window}catch(e){r=self}r.SparkMD5=e()}}((function(e){"use strict";
/*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */
/* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */var t=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];function n(e,t){var n=e[0],r=e[1],o=e[2],i=e[3];r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&o|~r&i)+t[0]-680876936|0)<<7|n>>>25)+r|0)&r|~n&o)+t[1]-389564586|0)<<12|i>>>20)+n|0)&n|~i&r)+t[2]+606105819|0)<<17|o>>>15)+i|0)&i|~o&n)+t[3]-1044525330|0)<<22|r>>>10)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&o|~r&i)+t[4]-176418897|0)<<7|n>>>25)+r|0)&r|~n&o)+t[5]+1200080426|0)<<12|i>>>20)+n|0)&n|~i&r)+t[6]-1473231341|0)<<17|o>>>15)+i|0)&i|~o&n)+t[7]-45705983|0)<<22|r>>>10)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&o|~r&i)+t[8]+1770035416|0)<<7|n>>>25)+r|0)&r|~n&o)+t[9]-1958414417|0)<<12|i>>>20)+n|0)&n|~i&r)+t[10]-42063|0)<<17|o>>>15)+i|0)&i|~o&n)+t[11]-1990404162|0)<<22|r>>>10)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&o|~r&i)+t[12]+1804603682|0)<<7|n>>>25)+r|0)&r|~n&o)+t[13]-40341101|0)<<12|i>>>20)+n|0)&n|~i&r)+t[14]-1502002290|0)<<17|o>>>15)+i|0)&i|~o&n)+t[15]+1236535329|0)<<22|r>>>10)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&i|o&~i)+t[1]-165796510|0)<<5|n>>>27)+r|0)&o|r&~o)+t[6]-1069501632|0)<<9|i>>>23)+n|0)&r|n&~r)+t[11]+643717713|0)<<14|o>>>18)+i|0)&n|i&~n)+t[0]-373897302|0)<<20|r>>>12)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&i|o&~i)+t[5]-701558691|0)<<5|n>>>27)+r|0)&o|r&~o)+t[10]+38016083|0)<<9|i>>>23)+n|0)&r|n&~r)+t[15]-660478335|0)<<14|o>>>18)+i|0)&n|i&~n)+t[4]-405537848|0)<<20|r>>>12)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&i|o&~i)+t[9]+568446438|0)<<5|n>>>27)+r|0)&o|r&~o)+t[14]-1019803690|0)<<9|i>>>23)+n|0)&r|n&~r)+t[3]-187363961|0)<<14|o>>>18)+i|0)&n|i&~n)+t[8]+1163531501|0)<<20|r>>>12)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r&i|o&~i)+t[13]-1444681467|0)<<5|n>>>27)+r|0)&o|r&~o)+t[2]-51403784|0)<<9|i>>>23)+n|0)&r|n&~r)+t[7]+1735328473|0)<<14|o>>>18)+i|0)&n|i&~n)+t[12]-1926607734|0)<<20|r>>>12)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r^o^i)+t[5]-378558|0)<<4|n>>>28)+r|0)^r^o)+t[8]-2022574463|0)<<11|i>>>21)+n|0)^n^r)+t[11]+1839030562|0)<<16|o>>>16)+i|0)^i^n)+t[14]-35309556|0)<<23|r>>>9)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r^o^i)+t[1]-1530992060|0)<<4|n>>>28)+r|0)^r^o)+t[4]+1272893353|0)<<11|i>>>21)+n|0)^n^r)+t[7]-155497632|0)<<16|o>>>16)+i|0)^i^n)+t[10]-1094730640|0)<<23|r>>>9)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r^o^i)+t[13]+681279174|0)<<4|n>>>28)+r|0)^r^o)+t[0]-358537222|0)<<11|i>>>21)+n|0)^n^r)+t[3]-722521979|0)<<16|o>>>16)+i|0)^i^n)+t[6]+76029189|0)<<23|r>>>9)+o|0,r=((r+=((o=((o+=((i=((i+=((n=((n+=(r^o^i)+t[9]-640364487|0)<<4|n>>>28)+r|0)^r^o)+t[12]-421815835|0)<<11|i>>>21)+n|0)^n^r)+t[15]+530742520|0)<<16|o>>>16)+i|0)^i^n)+t[2]-995338651|0)<<23|r>>>9)+o|0,r=((r+=((i=((i+=(r^((n=((n+=(o^(r|~i))+t[0]-198630844|0)<<6|n>>>26)+r|0)|~o))+t[7]+1126891415|0)<<10|i>>>22)+n|0)^((o=((o+=(n^(i|~r))+t[14]-1416354905|0)<<15|o>>>17)+i|0)|~n))+t[5]-57434055|0)<<21|r>>>11)+o|0,r=((r+=((i=((i+=(r^((n=((n+=(o^(r|~i))+t[12]+1700485571|0)<<6|n>>>26)+r|0)|~o))+t[3]-1894986606|0)<<10|i>>>22)+n|0)^((o=((o+=(n^(i|~r))+t[10]-1051523|0)<<15|o>>>17)+i|0)|~n))+t[1]-2054922799|0)<<21|r>>>11)+o|0,r=((r+=((i=((i+=(r^((n=((n+=(o^(r|~i))+t[8]+1873313359|0)<<6|n>>>26)+r|0)|~o))+t[15]-30611744|0)<<10|i>>>22)+n|0)^((o=((o+=(n^(i|~r))+t[6]-1560198380|0)<<15|o>>>17)+i|0)|~n))+t[13]+1309151649|0)<<21|r>>>11)+o|0,r=((r+=((i=((i+=(r^((n=((n+=(o^(r|~i))+t[4]-145523070|0)<<6|n>>>26)+r|0)|~o))+t[11]-1120210379|0)<<10|i>>>22)+n|0)^((o=((o+=(n^(i|~r))+t[2]+718787259|0)<<15|o>>>17)+i|0)|~n))+t[9]-343485551|0)<<21|r>>>11)+o|0,e[0]=n+e[0]|0,e[1]=r+e[1]|0,e[2]=o+e[2]|0,e[3]=i+e[3]|0}function r(e){var t,n=[];/* Andy King said do it this way. */for(t=0;t<64;t+=4)n[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return n}function o(e){var t,n=[];/* Andy King said do it this way. */for(t=0;t<64;t+=4)n[t>>2]=e[t]+(e[t+1]<<8)+(e[t+2]<<16)+(e[t+3]<<24);return n}function i(e){var t,o,i,s,a,u,c=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=c;t+=64)n(f,r(e.substring(t-64,t)));for(o=(e=e.substring(t-64)).length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;t<o;t+=1)i[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(i[t>>2]|=128<<(t%4<<3),t>55)for(n(f,i),t=0;t<16;t+=1)i[t]=0;
// Beware that the final length might not fit in 32 bits so we take care of that
return s=(s=8*c).toString(16).match(/(.*?)(.{0,8})$/),a=parseInt(s[2],16),u=parseInt(s[1],16)||0,i[14]=a,i[15]=u,n(f,i),f}function s(e){var n,r="";for(n=0;n<4;n+=1)r+=t[e>>8*n+4&15]+t[e>>8*n&15];return r}function a(e){var t;for(t=0;t<e.length;t+=1)e[t]=s(e[t]);return e.join("")}
// In some cases the fast add32 function cannot be used..
// ---------------------------------------------------
/**
     * Helpers.
     */function u(e){return/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e))),e}function c(e){var t,n=[],r=e.length;for(t=0;t<r-1;t+=2)n.push(parseInt(e.substr(t,2),16));return String.fromCharCode.apply(String,n)}
// ---------------------------------------------------
/**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */function f(){
// call reset to init the instance
this.reset()}
/**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */return a(i("hello")),
// ---------------------------------------------------
/**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */
"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||function(){function t(e,t){return(e=0|e||0)<0?Math.max(e+t,0):Math.min(e,t)}ArrayBuffer.prototype.slice=function(n,r){var o,i,s,a,u=this.byteLength,c=t(n,u),f=u;return r!==e&&(f=t(r,u)),c>f?new ArrayBuffer(0):(o=f-c,i=new ArrayBuffer(o),s=new Uint8Array(i),a=new Uint8Array(this,c,o),s.set(a),i)}}(),f.prototype.append=function(e){
// Converts the string to utf8 bytes if necessary
// Then append as binary
return this.appendBinary(u(e)),this
/**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */},f.prototype.appendBinary=function(e){this._buff+=e,this._length+=e.length;var t,o=this._buff.length;for(t=64;t<=o;t+=64)n(this._hash,r(this._buff.substring(t-64,t)));return this._buff=this._buff.substring(t-64),this
/**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */},f.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<o;t+=1)i[t>>2]|=r.charCodeAt(t)<<(t%4<<3);return this._finish(i,o),n=a(this._hash),e&&(n=c(n)),this.reset(),n
/**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */},f.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this
/**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */},f.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash.slice()}},
/**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
f.prototype.setState=function(e){return this._buff=e.buff,this._length=e.length,this._hash=e.hash,this
/**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */},f.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length
/**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */},f.prototype._finish=function(e,t){var r,o,i,s=t;if(e[s>>2]|=128<<(s%4<<3),s>55)for(n(this._hash,e),s=0;s<16;s+=1)e[s]=0;
// Do the final computation based on the tail and length
// Beware that the final length may not fit in 32 bits so we take care of that
r=(r=8*this._length).toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(r[2],16),i=parseInt(r[1],16)||0,e[14]=o,e[15]=i,n(this._hash,e)},
/**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} [raw] True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
f.hash=function(e,t){
// Converts the string to utf8 bytes if necessary
// Then compute it using the binary function
return f.hashBinary(u(e),t)},
/**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} [raw]     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
f.hashBinary=function(e,t){var n=a(i(e));return t?c(n):n},
// ---------------------------------------------------
/**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
f.ArrayBuffer=function(){
// call reset to init the instance
this.reset()},
/**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
f.ArrayBuffer.prototype.append=function(e){var t,r,i,s,a=(r=this._buff.buffer,i=e,!0,(s=new Uint8Array(r.byteLength+i.byteLength)).set(new Uint8Array(r)),s.set(new Uint8Array(i),r.byteLength),s),u=a.length;for(this._length+=e.byteLength,t=64;t<=u;t+=64)n(this._hash,o(a.subarray(t-64,t)));return this._buff=t-64<u?new Uint8Array(a.buffer.slice(t-64)):new Uint8Array(0),this
/**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */},f.ArrayBuffer.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<o;t+=1)i[t>>2]|=r[t]<<(t%4<<3);return this._finish(i,o),n=a(this._hash),e&&(n=c(n)),this.reset(),n
/**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */},f.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this
/**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */},f.ArrayBuffer.prototype.getState=function(){var e,t=f.prototype.getState.call(this);
// Convert buffer to a string
return t.buff=(e=t.buff,String.fromCharCode.apply(null,new Uint8Array(e))),t
/**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */},f.ArrayBuffer.prototype.setState=function(e){
// Convert string to buffer
return e.buff=function(e,t){var n,r=e.length,o=new ArrayBuffer(r),i=new Uint8Array(o);for(n=0;n<r;n+=1)i[n]=e.charCodeAt(n);return i}(e.buff),f.prototype.setState.call(this,e)},f.ArrayBuffer.prototype.destroy=f.prototype.destroy,f.ArrayBuffer.prototype._finish=f.prototype._finish,
/**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     [raw] True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
f.ArrayBuffer.hash=function(e,t){var r=a(function(e){var t,r,i,s,a,u,c=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=c;t+=64)n(f,o(e.subarray(t-64,t)));
// Not sure if it is a bug, however IE10 will always produce a sub array of length 1
// containing the last element of the parent array if the sub array specified starts
// beyond the length of the parent array - weird.
// https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
for(r=(e=t-64<c?e.subarray(t-64):new Uint8Array(0)).length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;t<r;t+=1)i[t>>2]|=e[t]<<(t%4<<3);if(i[t>>2]|=128<<(t%4<<3),t>55)for(n(f,i),t=0;t<16;t+=1)i[t]=0;
// Beware that the final length might not fit in 32 bits so we take care of that
return s=(s=8*c).toString(16).match(/(.*?)(.{0,8})$/),a=parseInt(s[2],16),u=parseInt(s[1],16)||0,i[14]=a,i[15]=u,n(f,i),f}(new Uint8Array(e)));return t?c(r):r},f}))},{}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const r=[];for(let e=0;e<256;++e)r.push((e+256).toString(16).substr(1));n.default=function(e,t){const n=t||0,o=r;// Note: Be careful editing this code!  It's been tuned for performance
// and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
return(o[e[n+0]]+o[e[n+1]]+o[e[n+2]]+o[e[n+3]]+"-"+o[e[n+4]]+o[e[n+5]]+"-"+o[e[n+6]]+o[e[n+7]]+"-"+o[e[n+8]]+o[e[n+9]]+"-"+o[e[n+10]]+o[e[n+11]]+o[e[n+12]]+o[e[n+13]]+o[e[n+14]]+o[e[n+15]]).toLowerCase()}},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"v1",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(n,"v3",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(n,"v4",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(n,"v5",{enumerable:!0,get:function(){return s.default}});var r=a(e("./v1.js")),o=a(e("./v3.js")),i=a(e("./v4.js")),s=a(e("./v5.js"));function a(e){return e&&e.__esModule?e:{default:e}}},{"./v1.js":19,"./v3.js":20,"./v4.js":22,"./v5.js":23}],16:[function(e,t,n){"use strict";
/**
 * Calculate output length with padding and bit length
 */function r(e){return 14+(e+64>>>9<<4)+1}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */function o(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
/*
 * These functions implement the four basic operations the algorithm uses.
 */function i(e,t,n,r,i,s){return o((a=o(o(t,e),o(r,s)))<<(u=i)|a>>>32-u,n);var a,u}function s(e,t,n,r,o,s,a){return i(t&n|~t&r,e,t,o,s,a)}function a(e,t,n,r,o,s,a){return i(t&r|n&~r,e,t,o,s,a)}function u(e,t,n,r,o,s,a){return i(t^n^r,e,t,o,s,a)}function c(e,t,n,r,o,s,a){return i(n^(t|~r),e,t,o,s,a)}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function(e){if("string"==typeof e){const t=unescape(encodeURIComponent(e));// UTF8 escape
e=new Uint8Array(t.length);for(let n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}
/*
 * Convert an array of little-endian words to an array of bytes
 */return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let o=0;o<n;o+=8){const n=e[o>>5]>>>o%32&255,i=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(i)}return t}(function(e,t){
/* append padding */
e[t>>5]|=128<<t%32,e[r(t)-1]=t;let n=1732584193,i=-271733879,f=-1732584194,l=271733878;for(let t=0;t<e.length;t+=16){const r=n,d=i,h=f,p=l;n=s(n,i,f,l,e[t],7,-680876936),l=s(l,n,i,f,e[t+1],12,-389564586),f=s(f,l,n,i,e[t+2],17,606105819),i=s(i,f,l,n,e[t+3],22,-1044525330),n=s(n,i,f,l,e[t+4],7,-176418897),l=s(l,n,i,f,e[t+5],12,1200080426),f=s(f,l,n,i,e[t+6],17,-1473231341),i=s(i,f,l,n,e[t+7],22,-45705983),n=s(n,i,f,l,e[t+8],7,1770035416),l=s(l,n,i,f,e[t+9],12,-1958414417),f=s(f,l,n,i,e[t+10],17,-42063),i=s(i,f,l,n,e[t+11],22,-1990404162),n=s(n,i,f,l,e[t+12],7,1804603682),l=s(l,n,i,f,e[t+13],12,-40341101),f=s(f,l,n,i,e[t+14],17,-1502002290),i=s(i,f,l,n,e[t+15],22,1236535329),n=a(n,i,f,l,e[t+1],5,-165796510),l=a(l,n,i,f,e[t+6],9,-1069501632),f=a(f,l,n,i,e[t+11],14,643717713),i=a(i,f,l,n,e[t],20,-373897302),n=a(n,i,f,l,e[t+5],5,-701558691),l=a(l,n,i,f,e[t+10],9,38016083),f=a(f,l,n,i,e[t+15],14,-660478335),i=a(i,f,l,n,e[t+4],20,-405537848),n=a(n,i,f,l,e[t+9],5,568446438),l=a(l,n,i,f,e[t+14],9,-1019803690),f=a(f,l,n,i,e[t+3],14,-187363961),i=a(i,f,l,n,e[t+8],20,1163531501),n=a(n,i,f,l,e[t+13],5,-1444681467),l=a(l,n,i,f,e[t+2],9,-51403784),f=a(f,l,n,i,e[t+7],14,1735328473),i=a(i,f,l,n,e[t+12],20,-1926607734),n=u(n,i,f,l,e[t+5],4,-378558),l=u(l,n,i,f,e[t+8],11,-2022574463),f=u(f,l,n,i,e[t+11],16,1839030562),i=u(i,f,l,n,e[t+14],23,-35309556),n=u(n,i,f,l,e[t+1],4,-1530992060),l=u(l,n,i,f,e[t+4],11,1272893353),f=u(f,l,n,i,e[t+7],16,-155497632),i=u(i,f,l,n,e[t+10],23,-1094730640),n=u(n,i,f,l,e[t+13],4,681279174),l=u(l,n,i,f,e[t],11,-358537222),f=u(f,l,n,i,e[t+3],16,-722521979),i=u(i,f,l,n,e[t+6],23,76029189),n=u(n,i,f,l,e[t+9],4,-640364487),l=u(l,n,i,f,e[t+12],11,-421815835),f=u(f,l,n,i,e[t+15],16,530742520),i=u(i,f,l,n,e[t+2],23,-995338651),n=c(n,i,f,l,e[t],6,-198630844),l=c(l,n,i,f,e[t+7],10,1126891415),f=c(f,l,n,i,e[t+14],15,-1416354905),i=c(i,f,l,n,e[t+5],21,-57434055),n=c(n,i,f,l,e[t+12],6,1700485571),l=c(l,n,i,f,e[t+3],10,-1894986606),f=c(f,l,n,i,e[t+10],15,-1051523),i=c(i,f,l,n,e[t+1],21,-2054922799),n=c(n,i,f,l,e[t+8],6,1873313359),l=c(l,n,i,f,e[t+15],10,-30611744),f=c(f,l,n,i,e[t+6],15,-1560198380),i=c(i,f,l,n,e[t+13],21,1309151649),n=c(n,i,f,l,e[t+4],6,-145523070),l=c(l,n,i,f,e[t+11],10,-1120210379),f=c(f,l,n,i,e[t+2],15,718787259),i=c(i,f,l,n,e[t+9],21,-343485551),n=o(n,r),i=o(i,d),f=o(f,h),l=o(l,p)}return[n,i,f,l]}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */(function(e){if(0===e.length)return[];const t=8*e.length,n=new Uint32Array(r(t));for(let r=0;r<t;r+=8)n[r>>5]|=(255&e[r/8])<<r%32;return n}(e),8*e.length))}},{}],17:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){if(!r)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)};
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
const r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),o=new Uint8Array(16)},{}],18:[function(e,t,n){"use strict";
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function r(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function o(e,t){return e<<t|e>>>32-t}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=function(e){const t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));// UTF8 escape
e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}e.push(128);const i=e.length/4+2,s=Math.ceil(i/16),a=new Array(s);for(let t=0;t<s;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];a[t]=n}a[s-1][14]=8*(e.length-1)/Math.pow(2,32),a[s-1][14]=Math.floor(a[s-1][14]),a[s-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<s;++e){const i=new Uint32Array(80);for(let t=0;t<16;++t)i[t]=a[e][t];for(let e=16;e<80;++e)i[e]=o(i[e-3]^i[e-8]^i[e-14]^i[e-16],1);let s=n[0],u=n[1],c=n[2],f=n[3],l=n[4];for(let e=0;e<80;++e){const n=Math.floor(e/20),a=o(s,5)+r(n,u,c,f)+l+t[n]+i[e]>>>0;l=f,f=c,c=o(u,30)>>>0,u=s,s=a}n[0]=n[0]+s>>>0,n[1]=n[1]+u>>>0,n[2]=n[2]+c>>>0,n[3]=n[3]+f>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}},{}],19:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=i(e("./rng.js")),o=i(e("./bytesToUuid.js"));function i(e){return e&&e.__esModule?e:{default:e}}
// **`v1()` - Generate time-based UUID**
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let s,a,u=0,c=0;n.default=// See https://github.com/uuidjs/uuid for API details
function(e,t,n){let i=t&&n||0;const f=t||[];let l=(e=e||{}).node||s,d=void 0!==e.clockseq?e.clockseq:a;// node and clockseq need to be initialized to random values if they're not
// specified.  We do this lazily to minimize issues related to insufficient
// system entropy.  See #189
if(null==l||null==d){const t=e.random||(e.rng||r.default)();null==l&&(
// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
l=s=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==d&&(
// Per 4.2.2, randomize (14 bit) clockseq
d=a=16383&(t[6]<<8|t[7]))}// UUID timestamps are 100 nano-second units since the Gregorian epoch,
// (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
// time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
// (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
let h=void 0!==e.msecs?e.msecs:Date.now(),p=void 0!==e.nsecs?e.nsecs:c+1;// Per 4.2.1.2, use count of uuid's generated during the current clock
// cycle to simulate higher resolution clock
// Time since last uuid creation (in msecs)
const v=h-u+(p-c)/1e4;// Per 4.2.1.2, Bump clockseq on clock regression
// Per 4.2.1.2 Throw error if too many uuids are requested
if(v<0&&void 0===e.clockseq&&(d=d+1&16383),// Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
// time interval
(v<0||h>u)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");u=h,c=p,a=d,// Per 4.1.4 - Convert from unix epoch to Gregorian epoch
h+=122192928e5;// `time_low`
const y=(1e4*(268435455&h)+p)%4294967296;f[i++]=y>>>24&255,f[i++]=y>>>16&255,f[i++]=y>>>8&255,f[i++]=255&y;// `time_mid`
const g=h/4294967296*1e4&268435455;f[i++]=g>>>8&255,f[i++]=255&g,// `time_high_and_version`
f[i++]=g>>>24&15|16,// include version
f[i++]=g>>>16&255,// `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
f[i++]=d>>>8|128,// `clock_seq_low`
f[i++]=255&d;// `node`
for(let e=0;e<6;++e)f[i+e]=l[e];return t||(0,o.default)(f)}},{"./bytesToUuid.js":14,"./rng.js":17}],20:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=i(e("./v35.js")),o=i(e("./md5.js"));function i(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.default)("v3",48,o.default);n.default=s},{"./md5.js":16,"./v35.js":21}],21:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,t,n){function r(e,r,i,s){const a=i&&s||0;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));// UTF8 escape
const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=function(e){
// Note: We assume we're being passed a valid uuid string
const t=[];return e.replace(/[a-fA-F0-9]{2}/g,(function(e){t.push(parseInt(e,16))})),t}(r)),!Array.isArray(e))throw TypeError("value must be an array of bytes");if(!Array.isArray(r)||16!==r.length)throw TypeError("namespace must be uuid string or an Array of 16 byte values");// Per 4.3
const u=n(r.concat(e));if(u[6]=15&u[6]|t,u[8]=63&u[8]|128,i)for(let e=0;e<16;++e)i[a+e]=u[e];return i||(0,o.default)(u)}// Function#name is not settable on some platforms (#270)
try{r.name=e;// eslint-disable-next-line no-empty
}catch(e){}// For CommonJS default export support
return r.DNS=i,r.URL=s,r},n.URL=n.DNS=void 0;var r,o=(r=e("./bytesToUuid.js"))&&r.__esModule?r:{default:r};const i="6ba7b810-9dad-11d1-80b4-00c04fd430c8";n.DNS=i;const s="6ba7b811-9dad-11d1-80b4-00c04fd430c8";n.URL=s},{"./bytesToUuid.js":14}],22:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=i(e("./rng.js")),o=i(e("./bytesToUuid.js"));function i(e){return e&&e.__esModule?e:{default:e}}n.default=function(e,t,n){"string"==typeof e&&(t="binary"===e?new Uint8Array(16):null,e=null);const i=(e=e||{}).random||(e.rng||r.default)();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
// Copy bytes to buffer, if provided
if(i[6]=15&i[6]|64,i[8]=63&i[8]|128,t){const e=n||0;for(let n=0;n<16;++n)t[e+n]=i[n];return t}return(0,o.default)(i)}},{"./bytesToUuid.js":14,"./rng.js":17}],23:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=i(e("./v35.js")),o=i(e("./sha1.js"));function i(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.default)("v5",80,o.default);n.default=s},{"./sha1.js":18,"./v35.js":21}],24:[function(e,t,n){"use strict";
/**
 * Stringify/parse functions that don't operate
 * recursively, so they avoid call stack exceeded
 * errors.
 */
// Convenience function for the parse function.
// This pop function is basically copied from
// pouchCollate.parseIndexableString
function r(e,t,n){var r=n[n.length-1];e===r.element&&(
// popping a meta-element, e.g. an object whose value is another object
n.pop(),r=n[n.length-1]);var o=r.element,i=r.index;Array.isArray(o)?o.push(e):i===t.length-2?o[t.pop()]=e:t.push(e);// obj with key only
}n.stringify=function(e){var t=[];t.push({obj:e});for(var n,r,o,i,s,a,u,c,f,l,d="";n=t.pop();)if(r=n.obj,d+=n.prefix||"",o=n.val||"")d+=o;else if("object"!=typeof r)d+=void 0===r?null:JSON.stringify(r);else if(null===r)d+="null";else if(Array.isArray(r)){for(t.push({val:"]"}),i=r.length-1;i>=0;i--)s=0===i?"":",",t.push({obj:r[i],prefix:s});t.push({val:"["})}else{for(u in// object
a=[],r)r.hasOwnProperty(u)&&a.push(u);for(t.push({val:"}"}),i=a.length-1;i>=0;i--)f=r[c=a[i]],l=i>0?",":"",l+=JSON.stringify(c)+":",t.push({obj:f,prefix:l});t.push({val:"{"})}return d},n.parse=function(e){for(var t,n,o,i,s,a,u,c,f,l=[],d=[],h=0;;)if("}"!==(t=e[h++])&&"]"!==t&&void 0!==t)switch(t){case" ":case"\t":case"\n":case":":case",":break;case"n":h+=3,// 'ull'
r(null,l,d);break;case"t":h+=3,// 'rue'
r(!0,l,d);break;case"f":h+=4,// 'alse'
r(!1,l,d);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"-":for(n="",h--;;){if(o=e[h++],!/[\d\.\-e\+]/.test(o)){h--;break}n+=o}r(parseFloat(n),l,d);break;case'"':for(i="",s=void 0,a=0;'"'!==(u=e[h++])||"\\"===s&&a%2==1;)i+=u,"\\"===(s=u)?a++:a=0;r(JSON.parse('"'+i+'"'),l,d);break;case"[":c={element:[],index:l.length},l.push(c.element),d.push(c);break;case"{":f={element:{},index:l.length},l.push(f.element),d.push(f);break;default:throw new Error("unexpectedly reached end of input: "+t)}else{if(1===l.length)return l.pop();r(l.pop(),l,d)}}},{}]},{},[11])(11)}));