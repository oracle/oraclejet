/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define("persist/PersistenceStore",[],(function(){"use strict";var e=function(e){this._name=e};return(e.prototype={}).getName=function(){return this._name},e.prototype.getVersion=function(){return this._version},e.prototype.Init=function(e){return e&&e.version?this._version=e.version:this._version="0",Promise.resolve()},e.prototype.upsert=function(e,t,n,r){throw TypeError("failed in abstract function")},e.prototype.upsertAll=function(e){throw TypeError("failed in abstract function")},e.prototype.find=function(e){throw TypeError("failed in abstract function")},e.prototype.findByKey=function(e){throw TypeError("failed in abstract function")},e.prototype.removeByKey=function(e){throw TypeError("failed in abstract function")},e.prototype.delete=function(e){throw TypeError("failed in abstract function")},e.prototype.keys=function(){throw TypeError("failed in abstract function")},e.prototype.updateKey=function(e,t){throw TypeError("failed in abstract function")},e})),define("persist/impl/storageUtils",["./logger"],(function(e){"use strict";function t(e){var r,s=[];for(var u in e)if(e.hasOwnProperty(u)){var a=e[u];if(0===u.indexOf("$")){if(i(u)){if(!(a instanceof Array))throw new Error("not a valid expression: "+e);r={operator:u,array:[]};for(var c=0;c<a.length;c++){var f=t(a[c]);r.array.push(f)}}else if(o(u))throw new Error("not a valid expression: "+e)}else if("object"!=typeof a)s.push({left:u,right:a,operator:"$eq"});else{var l={left:u};n(l,a),s.push(l)}}return s.length>1?r={operator:"$and",array:s}:1===s.length&&(r=s[0]),r}function n(e,t){var n=!1;for(var r in t)if(t.hasOwnProperty(r)){var i=t[r];if(n||!o(r))throw new Error("parsing error "+t);e.operator=r,e.right=i,n=!0}}function r(e,t){var n=e.operator;if(i(n)){if(!e.left&&e.array instanceof Array){for(var s,c=e.array,f=0;f<c.length;f++){var l=r(c[f],t);if("$or"===n&&!0===l)return!0;if("$and"===n&&!1===l)return!1;s=l}return s}throw new Error("invalid expression tree!"+e)}if(!o(n))throw new Error("not a valid expression!"+e);var d,h=a(e.left,t),p=e.right;if("$lt"===n)return(h=(d=u(h,p))[0])<d[1];if("$gt"===n)return(h=(d=u(h,p))[0])>d[1];if("$lte"===n)return(h=(d=u(h,p))[0])<=d[1];if("$gte"===n)return(h=(d=u(h,p))[0])>=d[1];if("$eq"===n)return h===p;if("$ne"===n)return h!==p;if("$regex"===n)return null!==h.match(p);if("$exists"===n)return p?null!=h:null==h;if("$in"!==n){if("$nin"===n)return p.indexOf(h)<0;throw new Error("not a valid expression! "+e)}for(var v=0;v<p.length;v++)if(p[v]===h)return!0;return!1}function i(e){return"$and"===e||"$or"===e}function o(e){return"$lt"===e||"$gt"===e||"$lte"===e||"$gte"===e||"$eq"===e||"$ne"===e||"$regex"===e||"$exists"===e||"$in"===e||"$nin"===e}function s(e){return null!=e&&(e instanceof String||"string"==typeof e)}function u(e,t){return s(e)&&null==t?t="":s(t)&&null==e&&(e=""),[e,t]}function a(e,t){for(var n=e.split("."),r=t,i=0;i<n.length;i++)r=r[n[i]];return r}return{satisfy:function(n,i){return e.log("Offline Persistence Toolkit storageUtils: Processing selector: "+JSON.stringify(n)),!n||r(t(n),i)},getValue:a,assembleObject:function(e,t){var n;if(t){n={};for(var r=0;r<t.length;r++)for(var i=n,o=e,s=t[r].split("."),u=0;u<s.length;u++)o=o[s[u]],!i[s[u]]&&u<s.length-1&&(i[s[u]]={}),u===s.length-1?i[s[u]]=o:i=i[s[u]]}else n=e;return n},sortRows:function(e,t){return e&&Array.isArray(e)&&!(e.length<1)&&t&&Array.isArray(t)&&t.length?e.sort(function(e){return function(t,n){for(var r=0;r<e.length;r++){var i,o=e[r],s=!0;if("string"==typeof o)i=o;else{if("object"!=typeof o)throw new Error("invalid sort criteria.");var u=Object.keys(o);if(!u||1!==u.length)throw new Error("invalid sort criteria");s="asc"===o[i=u[0]].toLowerCase()}var c=a(i,t),f=a(i,n);if(c!=f)return s?c<f?-1:1:c<f?1:-1}return 0}}(t)):e}}})),define("persist/impl/keyValuePersistenceStore",["../PersistenceStore","./storageUtils","./logger"],(function(e,t,n){"use strict";var r=function(t){e.call(this,t)};return(r.prototype=new e).Init=function(e){return this._version=e&&e.version||"0",Promise.resolve()},r.prototype.getItem=function(e){throw TypeError("failed in abstract function")},r.prototype.removeByKey=function(e){throw TypeError("failed in abstract function")},r.prototype.keys=function(){throw TypeError("failed in abstract function")},r.prototype.findByKey=function(e){return n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: findByKey() with key: "+e),this.getItem(e).then((function(e){return e?Promise.resolve(e.value):Promise.resolve()}))},r.prototype.find=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: find() with expression: "+JSON.stringify(e));var r=this,i=[],o=[];return e=e||{},this.keys().then((function(n){for(var s=[],u=0;u<n.length;u++){var a=n[u];a&&s.push(function(n){return r.getItem(n).then((function(r){r&&t.satisfy(e.selector,r)&&(r.key=n,o.push(r))}))}(a))}return Promise.all(s).then((function(){for(var n=t.sortRows(o,e.sort),s=0;s<n.length;s++)i.push(r._constructReturnObject(e.fields,n[s]));return Promise.resolve(i)}))}))},r.prototype.updateKey=function(e,t){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: updateKey() with currentKey: "+e+" and new key: "+t);var r=this;return this.getItem(e).then((function(e){return e?r._insert(t,e.metadata,e.value):Promise.reject("No existing key found to update")})).then((function(){return r.removeByKey(e)}))},r.prototype._constructReturnObject=function(e,n){return e?t.assembleObject(n,e):n.value},r.prototype._removeByKeyMapCallback=function(e){var t=this;return function(n){var r;return r=e?n[e]:n,t.removeByKey(r)}},r.prototype.delete=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: delete() with expression: "+JSON.stringify(e));var t=this;if(!e)return this.deleteAll();var r=e;return r.fields=["key"],t.find(r).then((function(e){if(e&&e.length){var n=e.map(t._removeByKeyMapCallback("key"),t);return Promise.all(n)}return Promise.resolve()}))},r.prototype.deleteAll=function(){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: deleteAll()");var e,t=this,r=[];return this.keys().then((function(n){for(e=0;e<n.length;e++)r.push(t.removeByKey(n[e]));return Promise.all(r)}))},r.prototype.upsert=function(e,t,r,i){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsert() for key: "+e);var o=this;return this.getItem(e).then((function(n){if(n&&i){var s=n.metadata.versionIdentifier;return s!==i?Promise.reject({status:409}):t.versionIdentifier!==s?o._insert(e,t,r):Promise.resolve()}return o._insert(e,t,r)}))},r.prototype.upsertAll=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsertAll()");for(var t=[],r=0;r<e.length;r++){var i=e[r];t.push(this.upsert(i.key,i.metadata,i.value,i.expectedVersionIndentifier))}return Promise.all(t)},r})),define("persist/impl/PersistenceStoreMetadata",[],(function(){"use strict";var e=function(e,t,n){this.name=e,this.persistenceStoreFactory=t,this.versions=n};return(e.prototype={}).persistenceStoreFactory,e.prototype.versions,e})),function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define("pouchdb",[],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).PouchDB=e()}((function(){return function e(t,n,r){function i(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[s]={exports:{}};t[s][0].call(f.exports,(function(e){return i(t[s][1][e]||e)}),f,f.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t,n){"use strict";t.exports=function(e){return function(){var t=arguments.length;if(t){for(var n=[],r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}return e.call(this,[])}}},{}],2:[function(e,t,n){},{}],3:[function(e,t,n){
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
var r=Object.create||function(e){var t=function(){};return t.prototype=e,new t},i=Object.keys||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return n},o=Function.prototype.bind||function(e){var t=this;return function(){return t.apply(e,arguments)}};function s(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=r(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}t.exports=s,
// Backwards-compat with node 0.10.x
s.EventEmitter=s,s.prototype._events=void 0,s.prototype._maxListeners=void 0;
// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var u,a=10;try{var c={};Object.defineProperty&&Object.defineProperty(c,"x",{value:0}),u=0===c.x}catch(e){u=!1}function f(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}
// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function l(e,t,n){if(t)e.call(n);else for(var r=e.length,i=w(e,r),o=0;o<r;++o)i[o].call(n)}function d(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,o=w(e,i),s=0;s<i;++s)o[s].call(n,r)}function h(e,t,n,r,i){if(t)e.call(n,r,i);else for(var o=e.length,s=w(e,o),u=0;u<o;++u)s[u].call(n,r,i)}function p(e,t,n,r,i,o){if(t)e.call(n,r,i,o);else for(var s=e.length,u=w(e,s),a=0;a<s;++a)u[a].call(n,r,i,o)}function v(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,o=w(e,i),s=0;s<i;++s)o[s].apply(n,r)}function y(e,t,n,i){var o,s,u;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((s=e._events)?(
// To avoid recursion in the case that type === "newListener"! Before
// adding it to the listeners, first emit "newListener".
s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),
// Re-assign `events` because a newListener handler could have caused the
// this._events to be assigned to a new object
s=e._events),u=s[t]):(s=e._events=r(null),e._eventsCount=0),u){
// Check for listener leak
if("function"==typeof u?
// Adding the second element, need to change to array.
u=s[t]=i?[n,u]:[u,n]:
// If we've already got an array, just append.
i?u.unshift(n):u.push(n),!u.warned&&(o=f(e))&&o>0&&u.length>o){u.warned=!0;var a=new Error("Possible EventEmitter memory leak detected. "+u.length+' "'+String(t)+'" listeners added. Use emitter.setMaxListeners() to increase limit.');a.name="MaxListenersExceededWarning",a.emitter=e,a.type=t,a.count=u.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",a.name,a.message)}}else
// Optimize the case of one listener. Don't need the extra array object.
u=s[t]=n,++e._eventsCount;return e}function g(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var e=new Array(arguments.length),t=0;t<e.length;++t)e[t]=arguments[t];this.listener.apply(this.target,e)}}function _(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=o.call(g,r);return i.listener=n,r.wrapFn=i,i}function m(e,t,n){var r=e._events;if(!r)return[];var i=r[t];return i?"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):w(i,i.length):[]}function b(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function w(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}u?Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){
// check whether the input is a positive number (whose value is zero or
// greater and not a NaN).
if("number"!=typeof e||e<0||e!=e)throw new TypeError('"defaultMaxListeners" must be a positive number');a=e}}):s.defaultMaxListeners=a,
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return f(this)},s.prototype.emit=function(e){var t,n,r,i,o,s,u="error"===e;if(s=this._events)u=u&&null==s.error;else if(!u)return!1;
// If there is no 'error' event listener then throw.
if(u){if(arguments.length>1&&(t=arguments[1]),t instanceof Error)throw t;// Unhandled 'error' event
// At least give some kind of context to the user
var a=new Error('Unhandled "error" event. ('+t+")");throw a.context=t,a}if(!(n=s[e]))return!1;var c="function"==typeof n;switch(r=arguments.length){
// fast cases
case 1:l(n,c,this);break;case 2:d(n,c,this,arguments[1]);break;case 3:h(n,c,this,arguments[1],arguments[2]);break;case 4:p(n,c,this,arguments[1],arguments[2],arguments[3]);break;
// slower
default:for(i=new Array(r-1),o=1;o<r;o++)i[o-1]=arguments[o];v(n,c,this,i)}return!0},s.prototype.addListener=function(e,t){return y(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return y(this,e,t,!0)},s.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,_(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,_(this,e,t)),this},
// Emits a 'removeListener' event if and only if the listener was removed.
s.prototype.removeListener=function(e,t){var n,i,o,s,u;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(i=this._events))return this;if(!(n=i[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=r(null):(delete i[e],i.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,s=n.length-1;s>=0;s--)if(n[s]===t||n[s].listener===t){u=n[s].listener,o=s;break}if(o<0)return this;0===o?n.shift():
// About 1.5x faster than the two-arg version of Array#splice().
function(e,t){for(var n=t,r=n+1,i=e.length;r<i;n+=1,r+=1)e[n]=e[r];e.pop()}(n,o),1===n.length&&(i[e]=n[0]),i.removeListener&&this.emit("removeListener",e,u||t)}return this},s.prototype.removeAllListeners=function(e){var t,n,o;if(!(n=this._events))return this;
// not listening for removeListener, no need to emit
if(!n.removeListener)return 0===arguments.length?(this._events=r(null),this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=r(null):delete n[e]),this;
// emit removeListener for all listeners on all events
if(0===arguments.length){var s,u=i(n);for(o=0;o<u.length;++o)"removeListener"!==(s=u[o])&&this.removeAllListeners(s);return this.removeAllListeners("removeListener"),this._events=r(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)
// LIFO order
for(o=t.length-1;o>=0;o--)this.removeListener(e,t[o]);return this},s.prototype.listeners=function(e){return m(this,e,!0)},s.prototype.rawListeners=function(e){return m(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):b.call(e,t)},s.prototype.listenerCount=b,s.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]}},{}],4:[function(e,t,n){"use strict";var r,i,o,s=[e("./nextTick"),e("./queueMicrotask"),e("./mutation.js"),e("./messageChannel"),e("./stateChange"),e("./timeout")],u=-1,a=[],c=!1;function f(){r&&i&&(r=!1,i.length?a=i.concat(a):u=-1,a.length&&l())}
//named nextTick for less confusing stack traces
function l(){if(!r){c=!1,r=!0;for(var e=a.length,t=setTimeout(f);e;){for(i=a,a=[];i&&++u<e;)i[u].run();u=-1,e=a.length}i=null,u=-1,r=!1,clearTimeout(t)}}for(var d=-1,h=s.length;++d<h;)if(s[d]&&s[d].test&&s[d].test()){o=s[d].install(l);break}
// v8 likes predictible objects
function p(e,t){this.fun=e,this.array=t}p.prototype.run=function(){var e=this.fun,t=this.array;switch(t.length){case 0:return e();case 1:return e(t[0]);case 2:return e(t[0],t[1]);case 3:return e(t[0],t[1],t[2]);default:return e.apply(null,t)}},t.exports=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];a.push(new p(e,t)),c||r||(c=!0,o())}},{"./messageChannel":5,"./mutation.js":6,"./nextTick":2,"./queueMicrotask":7,"./stateChange":8,"./timeout":9}],5:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return!e.setImmediate&&void 0!==e.MessageChannel},n.install=function(t){var n=new e.MessageChannel;return n.port1.onmessage=t,function(){n.port2.postMessage(0)}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],6:[function(e,t,n){(function(e){(function(){"use strict";
//based off rsvp https://github.com/tildeio/rsvp.js
//license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js
var t=e.MutationObserver||e.WebKitMutationObserver;n.test=function(){return t},n.install=function(n){var r=0,i=new t(n),o=e.document.createTextNode("");return i.observe(o,{characterData:!0}),function(){o.data=r=++r%2}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return"function"==typeof e.queueMicrotask},n.install=function(t){return function(){e.queueMicrotask(t)}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(e,t,n){(function(e){(function(){"use strict";n.test=function(){return"document"in e&&"onreadystatechange"in e.document.createElement("script")},n.install=function(t){return function(){
// Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
// into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
var n=e.document.createElement("script");return n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n),t}}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],9:[function(e,t,n){"use strict";n.test=function(){return!0},n.install=function(e){return function(){setTimeout(e,0)}}},{}],10:[function(e,t,n){"function"==typeof Object.create?
// implementation from standard node.js 'util' module
t.exports=function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:
// old school shim for old browsers
t.exports=function(e,t){if(t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}}},{}],11:[function(e,t,n){(function(n){(function(){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var i,o,s=r(e("immediate")),u=e("uuid"),a=r(e("spark-md5")),c=r(e("vuvuzela")),f=r(e("argsarray")),l=r(e("inherits")),d=r(e("events"));function h(e){return"$"+e}function p(e){return e.substring(1)}function v(){this._store={}}function y(e){
// init with an array
if(this._store=new v,e&&Array.isArray(e))for(var t=0,n=e.length;t<n;t++)this.add(e[t])}
// most of this is borrowed from lodash.isPlainObject:
// https://github.com/fis-components/lodash.isplainobject/
// blob/29c358140a74f252aeb08c9eb28bef86f2217d4a/index.js
v.prototype.get=function(e){var t=h(e);return this._store[t]},v.prototype.set=function(e,t){var n=h(e);return this._store[n]=t,!0},v.prototype.has=function(e){return h(e)in this._store},v.prototype.delete=function(e){var t=h(e),n=t in this._store;return delete this._store[t],n},v.prototype.forEach=function(e){for(var t=Object.keys(this._store),n=0,r=t.length;n<r;n++){var i=t[n];e(this._store[i],i=p(i))}},Object.defineProperty(v.prototype,"size",{get:function(){return Object.keys(this._store).length}}),y.prototype.add=function(e){return this._store.set(e,!0)},y.prototype.has=function(e){return this._store.has(e)},y.prototype.forEach=function(e){this._store.forEach((function(t,n){e(n)}))},Object.defineProperty(y.prototype,"size",{get:function(){return this._store.size}}),
/* global Map,Set,Symbol */
// Based on https://kangax.github.io/compat-table/es6/ we can sniff out
// incomplete Map/Set implementations which would otherwise cause our tests to fail.
// Notably they fail in IE11 and iOS 8.4, which this prevents.
function(){if("undefined"==typeof Symbol||"undefined"==typeof Map||"undefined"==typeof Set)return!1;var e=Object.getOwnPropertyDescriptor(Map,Symbol.species);return e&&"get"in e&&Map[Symbol.species]===Map}
// based on https://github.com/montagejs/collections
()?(// prefer built-in Map/Set
i=Set,o=Map):(// fall back to our polyfill
i=y,o=v);var g,_,m=Function.prototype.toString,b=m.call(Object);function w(e){var t,n,r;if(!e||"object"!=typeof e)return e;if(Array.isArray(e)){for(t=[],n=0,r=e.length;n<r;n++)t[n]=w(e[n]);return t}
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
if(Object.prototype.hasOwnProperty.call(e,n)){var i=w(e[n]);void 0!==i&&(t[n]=i)}return t}function k(e){var t=!1;return f((function(n){
/* istanbul ignore if */
if(t)
// this is a smoke test and should never actually happen
throw new Error("once called more than once");t=!0,e.apply(this,n)}))}function j(e){
//create the function we will be returning
return f((function(t){
// Clone arguments
t=w(t);var n=this,r="function"==typeof t[t.length-1]&&t.pop(),i=new Promise((function(r,i){var o;try{var s=k((function(e,t){e?i(e):r(t)}));
// create a callback for this invocation
// apply the function in the orig context
t.push(s),(o=e.apply(n,t))&&"function"==typeof o.then&&r(o)}catch(e){i(e)}}));
// if the last argument is a function, assume its a callback
// if there is a callback, call it back
return r&&i.then((function(e){r(null,e)}),r),i}))}function O(e,t){return j(f((function(n){if(this._closed)return Promise.reject(new Error("database is closed"));if(this._destroyed)return Promise.reject(new Error("database is destroyed"));var r=this;return function(e,t,n){
/* istanbul ignore if */
if(e.constructor.listeners("debug").length){for(var r=["api",e.name,t],i=0;i<n.length-1;i++)r.push(n[i]);e.constructor.emit("debug",r);
// override the callback itself to log the response
var o=n[n.length-1];n[n.length-1]=function(n,r){var i=["api",e.name,t];i=i.concat(n?["error",n]:["success",r]),e.constructor.emit("debug",i),o(n,r)}}}(r,e,n),this.taskqueue.isReady?t.apply(this,n):new Promise((function(t,i){r.taskqueue.addTask((function(o){o?i(o):t(r[e].apply(r,n))}))}))})))}
// like underscore/lodash _.pick()
function S(e,t){for(var n={},r=0,i=t.length;r<i;r++){var o=t[r];o in e&&(n[o]=e[o])}return n}
// Most browsers throttle concurrent requests at 6, so it's silly
// to shim _bulk_get by trying to launch potentially hundreds of requests
// and then letting the majority time out. We can handle this ourselves.
function P(e){return e}function A(e){return[{ok:e}]}
// shim for P/CouchDB adapters that don't directly implement _bulk_get
function x(e,t,n){var r=t.docs,i=new o;
// consolidate into one request per doc if possible
r.forEach((function(e){i.has(e.id)?i.get(e.id).push(e):i.set(e.id,[e])}));var s=i.size,u=0,a=new Array(s);function c(){var e;++u===s&&(e=[],a.forEach((function(t){t.docs.forEach((function(n){e.push({id:t.id,docs:[n]})}))})),n(null,{results:e}))}var f=[];i.forEach((function(e,t){f.push(t)}));var l=0;!function n(){if(!(l>=f.length)){var r=Math.min(l+6,f.length),o=f.slice(l,r);!function(r,o){r.forEach((function(r,s){var u=o+s,f=i.get(r),l=S(f[0],["atts_since","attachments"]);l.open_revs=f.map((function(e){
// rev is optional, open_revs disallowed
return e.rev})),
// remove falsey / undefined revisions
l.open_revs=l.open_revs.filter(P);var d=P;0===l.open_revs.length&&(delete l.open_revs,
// when fetching only the "winning" leaf,
// transform the result so it looks like an open_revs
// request
d=A),
// globally-supplied options
["revs","attachments","binary","ajax","latest"].forEach((function(e){e in t&&(l[e]=t[e])})),e.get(r,l,(function(e,t){var i,o,s;
/* istanbul ignore if */i=e?[{error:e}]:d(t),o=r,s=i,a[u]={id:o,docs:s},c(),n()}))}))}(o,l),l+=o.length}}()}try{localStorage.setItem("_pouch_check_localstorage",1),g=!!localStorage.getItem("_pouch_check_localstorage")}catch(e){g=!1}function q(){return g}
// Custom nextTick() shim for browsers. In node, this will just be process.nextTick(). We
function E(){d.call(this),this._listeners={},
/* istanbul ignore next */
function(e){q()&&addEventListener("storage",(function(t){e.emit(t.key)}))}(this)}function C(e){
/* istanbul ignore else */
if("undefined"!=typeof console&&"function"==typeof console[e]){var t=Array.prototype.slice.call(arguments,1);console[e].apply(console,t)}}function B(e){var t=0;return e||(t=2e3),function(e,t){var n=6e5;// Hard-coded default of 10 minutes
return e=parseInt(e,10)||0,(t=parseInt(t,10))!=t||t<=e?t=(e||1)<<1:t+=1,
// In order to not exceed maxTimeout, pick a random value between half of maxTimeout and maxTimeout
t>n&&(e=3e5,// divide by two
t=n),~~((t-e)*Math.random()+e);// ~~ coerces to an int, but fast.
}(e,t)}
// designed to give info to browser users, who are disturbed
// when they see http errors in the console
function $(e,t){C("info","The above "+e+" is totally normal. "+t)}l(E,d),E.prototype.addListener=function(e,t,n,r){
/* istanbul ignore if */
if(!this._listeners[t]){var i=this,o=!1;this._listeners[t]=u,this.on(e,u)}function u(){
/* istanbul ignore if */
if(i._listeners[t])if(o)o="waiting";else{o=!0;var e=S(r,["style","include_docs","attachments","conflicts","filter","doc_ids","view","since","query_params","binary","return_docs"]);
/* istanbul ignore next */n.changes(e).on("change",(function(e){e.seq>r.since&&!r.cancelled&&(r.since=e.seq,r.onChange(e))})).on("complete",(function(){"waiting"===o&&s(u),o=!1})).on("error",(function(){o=!1}))}}},E.prototype.removeListener=function(e,t){
/* istanbul ignore if */
t in this._listeners&&(d.prototype.removeListener.call(this,e,this._listeners[t]),delete this._listeners[t])},
/* istanbul ignore next */
E.prototype.notifyLocalWindows=function(e){
//do a useless change on a storage thing
//in order to get other windows's listeners to activate
q()&&(localStorage[e]="a"===localStorage[e]?"b":"a")},E.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)},_="function"==typeof Object.assign?Object.assign:function(e){for(var t=Object(e),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)// Skip over if undefined or null
for(var i in r)
// Avoid bugs when hasOwnProperty is shadowed
Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t};var T=_;function D(e,t,n){Error.call(this,n),this.status=e,this.name=t,this.message=n,this.error=!0}l(D,Error),D.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message,reason:this.reason})},new D(401,"unauthorized","Name or password is incorrect.");var L=new D(400,"bad_request","Missing JSON list of 'docs'"),I=new D(404,"not_found","missing"),R=new D(409,"conflict","Document update conflict"),M=new D(400,"bad_request","_id field must contain a string"),N=new D(412,"missing_id","_id is required for puts"),K=new D(400,"bad_request","Only reserved document ids may start with underscore."),U=(new D(412,"precondition_failed","Database not open"),new D(500,"unknown_error","Database encountered an unknown error")),F=new D(500,"badarg","Some query argument is invalid"),J=(new D(400,"invalid_request","Request was invalid"),new D(400,"query_parse_error","Some query parameter is invalid")),V=new D(500,"doc_validation","Bad special document member"),z=new D(400,"bad_request","Something wrong with the request"),G=new D(400,"bad_request","Document must be a JSON object"),Q=(new D(404,"not_found","Database not found"),new D(500,"indexed_db_went_bad","unknown")),W=(new D(500,"web_sql_went_bad","unknown"),new D(500,"levelDB_went_went_bad","unknown"),new D(403,"forbidden","Forbidden by design doc validate_doc_update function"),new D(400,"bad_request","Invalid rev format")),Y=(new D(412,"file_exists","The database could not be created, the file already exists."),new D(412,"missing_stub","A pre-existing attachment stub wasn't found"));function H(e,t){function n(t){for(
// inherit error properties from our parent error manually
// so as to allow proper JSON parsing.
/* jshint ignore:start */
var n=Object.getOwnPropertyNames(e),r=0,i=n.length;r<i;r++)"function"!=typeof e[n[r]]&&(this[n[r]]=e[n[r]]);
/* jshint ignore:end */void 0!==t&&(this.reason=t)}return n.prototype=D.prototype,new n(t)}function X(e){if("object"!=typeof e){var t=e;(e=U).data=t}return"error"in e&&"conflict"===e.error&&(e.name="conflict",e.status=409),"name"in e||(e.name=e.error||"unknown"),"status"in e||(e.status=500),"message"in e||(e.message=e.message||e.reason),e}function Z(e){var t={},n=e.filter&&"function"==typeof e.filter;return t.query=e.query_params,function(r){r.doc||(
// CSG sends events on the changes feed that don't have documents,
// this hack makes a whole lot of existing code robust.
r.doc={});var i=n&&function(e,t,n){try{return!e(t,n)}catch(e){var r="Filter function threw: "+e.toString();return H(z,r)}}(e.filter,r.doc,t);if("object"==typeof i)return i;if(i)return!1;if(e.include_docs){if(!e.attachments)for(var o in r.doc._attachments)
/* istanbul ignore else */
r.doc._attachments.hasOwnProperty(o)&&(r.doc._attachments[o].stub=!0)}else delete r.doc;return!0}}function ee(e){for(var t=[],n=0,r=e.length;n<r;n++)t=t.concat(e[n]);return t}
// shim for Function.prototype.name,
// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or
//     '_local'
//   - any other string value is a valid id
// Returns the specific error object for each case
function te(e){var t;if(e?"string"!=typeof e?t=H(M):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=H(K)):t=H(N),t)throw t}
// Checks if a PouchDB object is "remote" or not. This is
function ne(e){return"boolean"==typeof e._remote?e._remote:
/* istanbul ignore next */
"function"==typeof e.type&&(C("warn","db.type() is deprecated and will be removed in a future version of PouchDB"),"http"===e.type()
/* istanbul ignore next */)}function re(e){if(!e)return null;var t=e.split("/");return 2===t.length?t:1===t.length?[e,e]:null}function ie(e){var t=re(e);return t?t.join("/"):null}
// originally parseUri 1.2.2, now patched by us
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
new D(413,"invalid_url","Provided URL is invalid");var oe=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],se="queryKey",ue=/(?:^|&)([^&=]*)=?([^&]*)/g,ae=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;function ce(e){for(var t=ae.exec(e),n={},r=14;r--;){var i=oe[r],o=t[r]||"",s=-1!==["user","password"].indexOf(i);n[i]=s?decodeURIComponent(o):o}return n[se]={},n[oe[12]].replace(ue,(function(e,t,r){t&&(n[se][t]=r)})),n}
// Based on https://github.com/alexdavid/scope-eval v0.0.3
// (source: https://unpkg.com/scope-eval@0.0.3/scope_eval.js)
// This is basically just a wrapper around new Function()
function fe(e,t){var n=[],r=[];for(var i in t)t.hasOwnProperty(i)&&(n.push(i),r.push(t[i]));return n.push(e),Function.apply(null,n).apply(null,r)}
// this is essentially the "update sugar" function from daleharvey/pouchdb#1388
// the diffFun tells us what delta to apply to the doc.  it either returns
// the doc, or false if it doesn't need to do an update after all
function le(e,t,n){return new Promise((function(r,i){e.get(t,(function(o,s){if(o){
/* istanbul ignore next */
if(404!==o.status)return i(o);s={}}
// the user might change the _rev, so save it for posterity
var u=s._rev,a=n(s);if(!a)
// if the diffFun returns falsy, we short-circuit as
// an optimization
return r({updated:!1,rev:u});
// users aren't allowed to modify these values,
// so reset them here
a._id=t,a._rev=u,r(function(e,t,n){return e.put(t).then((function(e){return{updated:!0,rev:e.rev}}),(function(r){
/* istanbul ignore next */
if(409!==r.status)throw r;return le(e,t._id,n)}))}(e,a,n))}))}))}var de=function(e){return atob(e)},he=function(e){return btoa(e)};
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor (e.g.
// old QtWebKit versions, Android < 4.4).
function pe(e,t){
/* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
e=e||[],t=t||{};try{return new Blob(e,t)}catch(i){if("TypeError"!==i.name)throw i;for(var n=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)n.append(e[r]);return n.getBlob(t.type)}}
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function ve(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),i=0;i<t;i++)r[i]=e.charCodeAt(i);return n}function ye(e,t){return pe([ve(e)],{type:t})}function ge(e,t){return ye(de(e),t)}
//Can't find original post, but this is close
//http://stackoverflow.com/questions/6965107/ (continues on next line)
//converting-between-strings-and-arraybuffers
// shim for browsers that don't support it
function _e(e,t){var n=new FileReader,r="function"==typeof n.readAsBinaryString;n.onloadend=function(e){var n=e.target.result||"";if(r)return t(n);t(function(e){for(var t="",n=new Uint8Array(e),r=n.byteLength,i=0;i<r;i++)t+=String.fromCharCode(n[i]);return t}(n))},r?n.readAsBinaryString(e):n.readAsArrayBuffer(e)}function me(e,t){_e(e,(function(e){t(e)}))}function be(e,t){me(e,(function(e){t(he(e))}))}
// simplified API. universal browser support is assumed
// this is not used in the browser
var we=self.setImmediate||self.setTimeout;function ke(e,t,n,r,i){(n>0||r<t.size)&&(
// only slice blob if we really need to
t=function(e,t,n){return e.webkitSlice?e.webkitSlice(t,n):e.slice(t,n)}(t,n,r)),function(e,t){var n=new FileReader;n.onloadend=function(e){var n=e.target.result||new ArrayBuffer(0);t(n)},n.readAsArrayBuffer(e)}(t,(function(t){e.append(t),i()}))}function je(e,t,n,r,i){(n>0||r<t.length)&&(
// only create a substring if we really need to
t=t.substring(n,r)),e.appendBinary(t),i()}function Oe(e,t){var n="string"==typeof e,r=n?e.length:e.size,i=Math.min(32768,r),o=Math.ceil(r/i),s=0,u=n?new a:new a.ArrayBuffer,c=n?je:ke;function f(){we(d)}function l(){var e=function(e){return he(e)}(u.end(!0));t(e),u.destroy()}function d(){var t=s*i;s++,c(u,e,t,t+i,s<o?f:l)}d()}function Se(e){return a.hash(e)}function Pe(e,t){var n=w(e);return t?(delete n._rev_tree,Se(JSON.stringify(n))):u.v4().replace(/-/g,"").toLowerCase()}var Ae=u.v4;// mimic old import, only v4 is ever used elsewhere
// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
function xe(e){for(var t,n,r,i,o=e.rev_tree.slice();i=o.pop();){var s=i.ids,u=s[2],a=i.pos;if(u.length)// non-leaf
for(var c=0,f=u.length;c<f;c++)o.push({pos:a+1,ids:u[c]});else{var l=!!s[1].deleted,d=s[0];
// sort by deleted, then pos, then id
t&&!(r!==l?r:n!==a?n<a:t<d)||(t=d,n=a,r=l)}}return n+"-"+t}
// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
function qe(e,t){for(var n,r=e.slice();n=r.pop();)for(var i=n.pos,o=n.ids,s=o[2],u=t(0===s.length,i,o[0],n.ctx,o[1]),a=0,c=s.length;a<c;a++)r.push({pos:i+1,ids:s[a],ctx:u})}function Ee(e,t){return e.pos-t.pos}function Ce(e){var t=[];qe(e,(function(e,n,r,i,o){e&&t.push({rev:n+"-"+r,pos:n,opts:o})})),t.sort(Ee).reverse();for(var n=0,r=t.length;n<r;n++)delete t[n].pos;return t}
// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
function Be(e){for(var t=xe(e),n=Ce(e.rev_tree),r=[],i=0,o=n.length;i<o;i++){var s=n[i];s.rev===t||s.opts.deleted||r.push(s.rev)}return r}
// compact a tree by marking its non-leafs as missing,
// and return a list of revs to delete
// build up a list of all the paths to the leafs in this revision tree
function $e(e){for(var t,n=[],r=e.slice();t=r.pop();){var i=t.pos,o=t.ids,s=o[0],u=o[1],a=o[2],c=0===a.length,f=t.history?t.history.slice():[];f.push({id:s,opts:u}),c&&n.push({pos:i+1-f.length,ids:f});for(var l=0,d=a.length;l<d;l++)r.push({pos:i+1,ids:a[l],history:f})}return n.reverse()}
// for a better overview of what this is doing, read:
function Te(e,t){return e.pos-t.pos}
// classic binary search
// assuming the arr is sorted, insert the item in the proper place
function De(e,t,n){var r=function(e,t,n){for(var r,i=0,o=e.length;i<o;)n(e[r=i+o>>>1],t)<0?i=r+1:o=r;return i}(e,t,n);e.splice(r,0,t)}
// Turn a path as a flat array into a tree with a single branch.
// If any should be stemmed from the beginning of the array, that's passed
// in as the second argument
function Le(e,t){for(var n,r,i=t,o=e.length;i<o;i++){var s=e[i],u=[s.id,s.opts,[]];r?(r[2].push(u),r=u):n=r=u}return n}
// compare the IDs of two trees
function Ie(e,t){return e[0]<t[0]?-1:1}
// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function Re(e,t){for(var n=[{tree1:e,tree2:t}],r=!1;n.length>0;){var i=n.pop(),o=i.tree1,s=i.tree2;(o[1].status||s[1].status)&&(o[1].status="available"===o[1].status||"available"===s[1].status?"available":"missing");for(var u=0;u<s[2].length;u++)if(o[2][0]){for(var a=!1,c=0;c<o[2].length;c++)o[2][c][0]===s[2][u][0]&&(n.push({tree1:o[2][c],tree2:s[2][u]}),a=!0);a||(r="new_branch",De(o[2],s[2][u],Ie))}else r="new_leaf",o[2][0]=s[2][u]}return{conflicts:r,tree:e}}function Me(e,t,n){var r,i=[],o=!1,s=!1;if(!e.length)return{tree:[t],conflicts:"new_leaf"};for(var u=0,a=e.length;u<a;u++){var c=e[u];if(c.pos===t.pos&&c.ids[0]===t.ids[0])
// Paths start at the same position and have the same root, so they need
// merged
r=Re(c.ids,t.ids),i.push({pos:c.pos,ids:r.tree}),o=o||r.conflicts,s=!0;else if(!0!==n){
// The paths start at a different position, take the earliest path and
// traverse up until it as at the same point from root as the path we
// want to merge.  If the keys match we return the longer path with the
// other merged After stemming we dont want to expand the trees
var f=c.pos<t.pos?c:t,l=c.pos<t.pos?t:c,d=l.pos-f.pos,h=[],p=[];for(p.push({ids:f.ids,diff:d,parent:null,parentIdx:null});p.length>0;){var v=p.pop();if(0!==v.diff)for(var y=v.ids[2],g=0,_=y.length;g<_;g++)p.push({ids:y[g],diff:v.diff-1,parent:v.ids,parentIdx:g});else v.ids[0]===l.ids[0]&&h.push(v)}var m=h[0];m?(r=Re(m.ids,l.ids),m.parent[2][m.parentIdx]=r.tree,i.push({pos:f.pos,ids:f.ids}),o=o||r.conflicts,s=!0):i.push(c)}else i.push(c)}
// We didnt find
return s||i.push(t),i.sort(Te),{tree:i,conflicts:o||"internal_node"}}
// To ensure we dont grow the revision tree infinitely, we stem old revisions
function Ne(e,t,n){var r=Me(e,t),i=function(e,t){for(
// First we break out the tree into a complete list of root to leaf paths
var n,r,i=$e(e),o=0,s=i.length;o<s;o++){
// Then for each path, we cut off the start of the path based on the
// `depth` to stem to, and generate a new set of flat trees
var u,a=i[o],c=a.ids;if(c.length>t){
// only do the stemming work if we actually need to stem
n||(n={});var f=c.length-t;u={pos:a.pos+f,ids:Le(c,f)};for(var l=0;l<f;l++){var d=a.pos+l+"-"+c[l].id;n[d]=!0}}else// no need to actually stem
u={pos:a.pos,ids:Le(c,0)};
// Then we remerge all those flat trees together, ensuring that we dont
// connect trees that would go beyond the depth limit
r=r?Me(r,u,!0).tree:[u]}
// this is memory-heavy per Chrome profiler, avoid unless we actually stemmed
return n&&qe(r,(function(e,t,r){
// some revisions may have been removed in a branch but not in another
delete n[t+"-"+r]})),{tree:r,revs:n?Object.keys(n):[]}}(r.tree,n);return{tree:i.tree,stemmedRevs:i.revs,conflicts:r.conflicts}}
// return true if a rev exists in the rev tree, false otherwise
function Ke(e){return e.ids}
// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
function Ue(e,t){t||(t=xe(e));for(var n,r=t.substring(t.indexOf("-")+1),i=e.rev_tree.map(Ke);n=i.pop();){if(n[0]===r)return!!n[1].deleted;i=i.concat(n[2])}}function Fe(e){return/^_local/.test(e)}
// returns the current leaf node for a given revision
function Je(e,t,n){d.call(this);var r=this;this.db=e;var i=(t=t?w(t):{}).complete=k((function(t,n){var i,s;t?(s="error",("listenerCount"in(i=r)?i.listenerCount(s):d.listenerCount(i,s))>0&&r.emit("error",t)):r.emit("complete",n),r.removeAllListeners(),e.removeListener("destroyed",o)}));function o(){r.cancel()}n&&(r.on("complete",(function(e){n(null,e)})),r.on("error",n)),e.once("destroyed",o),t.onChange=function(e,t,n){
/* istanbul ignore if */
r.isCancelled||function(e,t,n,r){
// isolate try/catches to avoid V8 deoptimizations
try{e.emit("change",t,n,r)}catch(e){C("error",'Error in .on("change", function):',e)}}(r,e,t,n)};var s=new Promise((function(e,n){t.complete=function(t,r){t?n(t):e(r)}}));r.once("cancel",(function(){e.removeListener("destroyed",o),t.complete(null,{status:"cancelled"})})),this.then=s.then.bind(s),this.catch=s.catch.bind(s),this.then((function(e){i(null,e)}),i),e.taskqueue.isReady?r.validateChanges(t):e.taskqueue.addTask((function(e){e?t.complete(e):r.isCancelled?r.emit("cancel"):r.validateChanges(t)}))}function Ve(e,t,n){var r=[{rev:e._rev}];"all_docs"===n.style&&(r=Ce(t.rev_tree).map((function(e){return{rev:e.rev}})));var i={id:t.id,changes:r,doc:e};return Ue(t,e._rev)&&(i.deleted=!0),n.conflicts&&(i.doc._conflicts=Be(t),i.doc._conflicts.length||delete i.doc._conflicts),i}
/*
 * A generic pouch adapter
 */function ze(e,t){return e<t?-1:e>t?1:0}
// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function Ge(e,t){return function(n,r){n||r[0]&&r[0].error?((n=n||r[0]).docId=t,e(n)):e(null,r.length?r[0]:r)}}
// clean docs given to us by the user
// compare two docs, first by _id then by _rev
function Qe(e,t){var n=ze(e._id,t._id);return 0!==n?n:ze(e._revisions?e._revisions.start:0,t._revisions?t._revisions.start:0)}
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
return{name:/https?/.test(n[1])?n[1]+"://"+n[2]:n[2],adapter:n[1]};var r=Xe.adapters,i=Xe.preferredAdapters,o=Xe.prefix,s=t.adapter;if(!s)// automatically determine adapter
for(var u=0;u<i.length&&"idb"===(s=i[u])&&"websql"in r&&q()&&localStorage["_pouch__websqldb_"+o+e];++u)
// log it, because this can be confusing during development
C("log",'PouchDB is downgrading "'+e+'" to WebSQL to avoid data loss, because it was already opened with WebSQL.');var a=r[s];
// if adapter is invalid, then an error will be thrown later
return{name:a&&"use_prefix"in a&&!a.use_prefix?e:o+e,adapter:s}}
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
/* istanbul ignore else */Xe._changesFilterPlugin?Xe._changesFilterPlugin.validate(e,(function(r){if(r)return t(r);n.doChanges(e)})):n.doChanges(e)},Je.prototype.doChanges=function(e){var t=this,n=e.complete;if("live"in(e=w(e))&&!("continuous"in e)&&(e.continuous=e.live),e.processChange=Ve,"latest"===e.since&&(e.since="now"),e.since||(e.since=0),"now"!==e.since
/* istanbul ignore else */){if(Xe._changesFilterPlugin){if(Xe._changesFilterPlugin.normalize(e),Xe._changesFilterPlugin.shouldFilter(this,e))return Xe._changesFilterPlugin.filter(this,e)}else["doc_ids","filter","selector","view"].forEach((function(t){t in e&&C("warn",'The "'+t+'" option was passed in to changes/replicate, but pouchdb-changes-filter plugin is not installed, so it was ignored. Please install the plugin to enable filtering.')}));"descending"in e||(e.descending=!1),
// 0 and 1 should return 1 document
e.limit=0===e.limit?1:e.limit,e.complete=n;var r=this.db._changes(e);
/* istanbul ignore else */if(r&&"function"==typeof r.cancel){var i=t.cancel;t.cancel=f((function(e){r.cancel(),i.apply(this,e)}))}}else this.db.info().then((function(r){
/* istanbul ignore if */
t.isCancelled?n(null,{status:"cancelled"}):(e.since=r.update_seq,t.doChanges(e))}),n)},l(Ye,d),Ye.prototype.post=O("post",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(H(G));this.bulkDocs({docs:[e]},t,Ge(n,e._id))})),Ye.prototype.put=O("put",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(H(G));if(te(e._id),Fe(e._id)&&"function"==typeof this._putLocal)return e._deleted?this._removeLocal(e,n):this._putLocal(e,n);var r,i,o,s,u=this;function a(n){"function"==typeof u._put&&!1!==t.new_edits?u._put(e,t,n):u.bulkDocs({docs:[e]},t,Ge(n,e._id))}t.force&&e._rev?(i=(r=e._rev.split("-"))[1],o=parseInt(r[0],10)+1,s=Pe(),e._revisions={start:o,ids:[s,i]},e._rev=o+"-"+s,t.new_edits=!1,a((function(t){var r=t?null:{ok:!0,id:e._id,rev:e._rev};n(t,r)}))):a(n)})),Ye.prototype.putAttachment=O("putAttachment",(function(e,t,n,r,i){var o=this;function s(e){var n="_rev"in e?parseInt(e._rev,10):0;return e._attachments=e._attachments||{},e._attachments[t]={content_type:i,data:r,revpos:++n},o.put(e)}return"function"==typeof i&&(i=r,r=n,n=null),
// Lets fix in https://github.com/pouchdb/pouchdb/issues/3267
/* istanbul ignore if */
void 0===i&&(i=r,r=n,n=null),i||C("warn","Attachment",t,"on document",e,"is missing content_type"),o.get(e).then((function(e){if(e._rev!==n)throw H(R);return s(e)}),(function(t){
// create new doc
/* istanbul ignore else */
if(t.reason===I.message)return s({_id:e});throw t}))})),Ye.prototype.removeAttachment=O("removeAttachment",(function(e,t,n,r){var i=this;i.get(e,(function(e,o){
/* istanbul ignore if */
if(e)r(e);else if(o._rev===n){
/* istanbul ignore if */
if(!o._attachments)return r();delete o._attachments[t],0===Object.keys(o._attachments).length&&delete o._attachments,i.put(o,r)}else r(H(R))}))})),Ye.prototype.remove=O("remove",(function(e,t,n,r){var i;"string"==typeof t?(
// id, rev, opts, callback style
i={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(
// doc, opts, callback style
i=e,"function"==typeof t?(r=t,n={}):(r=n,n=t)),(n=n||{}).was_delete=!0;var o={_id:i._id,_rev:i._rev||n.rev,_deleted:!0};if(Fe(o._id)&&"function"==typeof this._removeLocal)return this._removeLocal(i,r);this.bulkDocs({docs:[o]},n,Ge(r,o._id))})),Ye.prototype.revsDiff=O("revsDiff",(function(e,t,n){"function"==typeof t&&(n=t,t={});var r=Object.keys(e);if(!r.length)return n(null,{});var i=0,s=new o;function u(e,t){s.has(e)||s.set(e,{missing:[]}),s.get(e).missing.push(t)}r.map((function(t){this._getRevisionTree(t,(function(o,a){if(o&&404===o.status&&"missing"===o.message)s.set(t,{missing:e[t]});else{if(o)
/* istanbul ignore next */
return n(o);!function(t,n){
// Is this fast enough? Maybe we should switch to a set simulated by a map
var r=e[t].slice(0);qe(n,(function(e,n,i,o,s){var a=n+"-"+i,c=r.indexOf(a);-1!==c&&(r.splice(c,1),
/* istanbul ignore if */
"available"!==s.status&&u(t,a))})),
// Traversing the tree is synchronous, so now `missingForId` contains
// revisions that were not found in the tree
r.forEach((function(e){u(t,e)}))}(t,a)}if(++i===r.length){
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
Ye.prototype.compactDocument=O("compactDocument",(function(e,t,n){var r=this;this._getRevisionTree(e,(function(i,o){
/* istanbul ignore if */
if(i)return n(i);var s=function(e){var t={},n=[];return qe(e,(function(e,r,i,o){var s=r+"-"+i;return e&&(t[s]=0),void 0!==o&&n.push({from:o,to:s}),s})),n.reverse(),n.forEach((function(e){void 0===t[e.from]?t[e.from]=1+t[e.to]:t[e.from]=Math.min(t[e.from],1+t[e.to])})),t}(o),u=[],a=[];Object.keys(s).forEach((function(e){s[e]>t&&u.push(e)})),qe(o,(function(e,t,n,r,i){var o=t+"-"+n;"available"===i.status&&-1!==u.indexOf(o)&&a.push(o)})),r._doCompaction(e,a,n)}))})),
// compact the whole database using single document
// compaction
Ye.prototype.compact=O("compact",(function(e,t){"function"==typeof e&&(t=e,e={});var n=this;e=e||{},n._compactionQueue=n._compactionQueue||[],n._compactionQueue.push({opts:e,callback:t}),1===n._compactionQueue.length&&We(n)})),Ye.prototype._compact=function(e,t){var n=this,r={return_docs:!1,last_seq:e.last_seq||0},i=[];n.changes(r).on("change",(function(e){i.push(n.compactDocument(e.id,0))})).on("complete",(function(e){var r=e.last_seq;Promise.all(i).then((function(){return le(n,"_local/compaction",(function(e){return(!e.last_seq||e.last_seq<r)&&(e.last_seq=r,e)}))})).then((function(){t(null,{ok:!0})})).catch(t)})).on("error",t)},
/* Begin api wrappers. Specific functionality to storage belongs in the
   _[method] */
Ye.prototype.get=O("get",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),"string"!=typeof e)return n(H(M));if(Fe(e)&&"function"==typeof this._getLocal)return this._getLocal(e,n);var r=[],i=this;function o(){var o=[],s=r.length;
/* istanbul ignore if */if(!s)return n(null,o);
// order with open_revs is unspecified
r.forEach((function(r){i.get(e,{rev:r,revs:t.revs,latest:t.latest,attachments:t.attachments,binary:t.binary},(function(e,t){if(e)o.push({missing:r});else{for(
// using latest=true can produce duplicates
var i,u=0,a=o.length;u<a;u++)if(o[u].ok&&o[u].ok._rev===t._rev){i=!0;break}i||o.push({ok:t})}--s||n(null,o)}))}))}if(!t.open_revs)return this._get(e,t,(function(r,o){if(r)return r.docId=e,n(r);var s=o.doc,u=o.metadata,a=o.ctx;if(t.conflicts){var c=Be(u);c.length&&(s._conflicts=c)}if(Ue(u,s._rev)&&(s._deleted=!0),t.revs||t.revs_info){for(var f=s._rev.split("-"),l=parseInt(f[0],10),d=f[1],h=$e(u.rev_tree),p=null,v=0;v<h.length;v++){var y=h[v],g=y.ids.map((function(e){return e.id})).indexOf(d);(g===l-1||!p&&-1!==g)&&(p=y)}
/* istanbul ignore if */if(!p)return(r=new Error("invalid rev tree")).docId=e,n(r);var _=p.ids.map((function(e){return e.id})).indexOf(s._rev.split("-")[1])+1,m=p.ids.length-_;if(p.ids.splice(_,m),p.ids.reverse(),t.revs&&(s._revisions={start:p.pos+p.ids.length-1,ids:p.ids.map((function(e){return e.id}))}),t.revs_info){var b=p.pos+p.ids.length;s._revs_info=p.ids.map((function(e){return{rev:--b+"-"+e.id,status:e.opts.status}}))}}if(t.attachments&&s._attachments){var w=s._attachments,k=Object.keys(w).length;if(0===k)return n(null,s);Object.keys(w).forEach((function(e){this._getAttachment(s._id,e,w[e],{
// Previously the revision handling was done in adapter.js
// getAttachment, however since idb-next doesnt we need to
// pass the rev through
rev:s._rev,binary:t.binary,ctx:a},(function(t,r){var i=s._attachments[e];i.data=r,delete i.stub,delete i.length,--k||n(null,s)}))}),i)}else{if(s._attachments)for(var j in s._attachments)
/* istanbul ignore else */
s._attachments.hasOwnProperty(j)&&(s._attachments[j].stub=!0);n(null,s)}}));if("all"===t.open_revs)this._getRevisionTree(e,(function(e,t){
/* istanbul ignore if */
if(e)return n(e);r=Ce(t).map((function(e){return e.rev})),o()}));else{if(!Array.isArray(t.open_revs))return n(H(U,"function_clause"));r=t.open_revs;for(var s=0;s<r.length;s++){var u=r[s];
// looks like it's the only thing couchdb checks
if("string"!=typeof u||!/^\d+-/.test(u))return n(H(W))}o()}})),
// TODO: I dont like this, it forces an extra read for every
// attachment read and enforces a confusing api between
// adapter.js and the adapter implementation
Ye.prototype.getAttachment=O("getAttachment",(function(e,t,n,r){var i=this;n instanceof Function&&(r=n,n={}),this._get(e,n,(function(o,s){return o?r(o):s.doc._attachments&&s.doc._attachments[t]?(n.ctx=s.ctx,n.binary=!0,void i._getAttachment(e,t,s.doc._attachments[t],n,r)):r(H(I))}))})),Ye.prototype.allDocs=O("allDocs",(function(e,t){if("function"==typeof e&&(t=e,e={}),e.skip=void 0!==e.skip?e.skip:0,e.start_key&&(e.startkey=e.start_key),e.end_key&&(e.endkey=e.end_key),"keys"in e){if(!Array.isArray(e.keys))return t(new TypeError("options.keys must be an array"));var n=["startkey","endkey","key"].filter((function(t){return t in e}))[0];if(n)return void t(H(J,"Query parameter `"+n+"` is not compatible with multi-get"));if(!ne(this)&&(function(e){var t="limit"in e?e.keys.slice(e.skip,e.limit+e.skip):e.skip>0?e.keys.slice(e.skip):e.keys;e.keys=t,e.skip=0,delete e.limit,e.descending&&(t.reverse(),e.descending=!1)}(e),0===e.keys.length))return this._allDocs({limit:0},t)}return this._allDocs(e,t)})),Ye.prototype.changes=function(e,t){return"function"==typeof e&&(t=e,e={}),
// By default set return_docs to false if the caller has opts.live = true,
// this will prevent us from collecting the set of changes indefinitely
// resulting in growing memory
(e=e||{}).return_docs="return_docs"in e?e.return_docs:!e.live,new Je(this,e,t)},Ye.prototype.close=O("close",(function(e){return this._closed=!0,this.emit("closed"),this._close(e)})),Ye.prototype.info=O("info",(function(e){var t=this;this._info((function(n,r){if(n)return e(n);
// assume we know better than the adapter, unless it informs us
r.db_name=r.db_name||t.name,r.auto_compaction=!(!t.auto_compaction||ne(t)),r.adapter=t.adapter,e(null,r)}))})),Ye.prototype.id=O("id",(function(e){return this._id(e)})),
/* istanbul ignore next */
Ye.prototype.type=function(){return"function"==typeof this._type?this._type():this.adapter},Ye.prototype.bulkDocs=O("bulkDocs",(function(e,t,n){if("function"==typeof t&&(n=t,t={}),t=t||{},Array.isArray(e)&&(e={docs:e}),!e||!e.docs||!Array.isArray(e.docs))return n(H(L));for(var r=0;r<e.docs.length;++r)if("object"!=typeof e.docs[r]||Array.isArray(e.docs[r]))return n(H(G));var i;if(e.docs.forEach((function(e){e._attachments&&Object.keys(e._attachments).forEach((function(t){i=i||function(e){return"_"===e.charAt(0)&&e+" is not a valid attachment name, attachment names cannot start with '_'"}(t),e._attachments[t].content_type||C("warn","Attachment",t,"on document",e._id,"is missing content_type")}))})),i)return n(H(z,i));"new_edits"in t||(t.new_edits=!("new_edits"in e)||e.new_edits);var o=this;t.new_edits||ne(o)||
// ensure revisions of the same doc are sorted, so that
// the local adapter processes them correctly (#2935)
e.docs.sort(Qe),function(e){for(var t=0;t<e.length;t++){var n=e[t];if(n._deleted)delete n._attachments;// ignore atts for deleted docs
else if(n._attachments)for(
// filter out extraneous keys from _attachments
var r=Object.keys(n._attachments),i=0;i<r.length;i++){var o=r[i];n._attachments[o]=S(n._attachments[o],["data","digest","content_type","length","revpos","stub"])}}}(e.docs);
// in the case of conflicts, we want to return the _ids to the user
// however, the underlying adapter may destroy the docs array, so
// create a copy here
var s=e.docs.map((function(e){return e._id}));return this._bulkDocs(e,t,(function(e,r){if(e)return n(e);
// add ids for error/conflict responses (not required for CouchDB)
if(t.new_edits||(
// this is what couch does when new_edits is false
r=r.filter((function(e){return e.error}))),!ne(o))for(var i=0,u=r.length;i<u;i++)r[i].id=r[i].id||s[i];n(null,r)}))})),Ye.prototype.registerDependentDatabase=O("registerDependentDatabase",(function(e,t){var n=new this.constructor(e,this.__opts);le(this,"_local/_pouch_dependentDbs",(function(t){return t.dependentDbs=t.dependentDbs||{},!t.dependentDbs[e]&&(t.dependentDbs[e]=!0,t)})).then((function(){t(null,{db:n})})).catch(t)})),Ye.prototype.destroy=O("destroy",(function(e,t){"function"==typeof e&&(t=e,e={});var n=this,r=!("use_prefix"in n)||n.use_prefix;function i(){
// call destroy method of the particular adaptor
n._destroy(e,(function(e,r){if(e)return t(e);n._destroyed=!0,n.emit("destroyed"),t(null,r||{ok:!0})}))}if(ne(n))
// no need to check for dependent DBs if it's a remote DB
return i();n.get("_local/_pouch_dependentDbs",(function(e,o){if(e)
/* istanbul ignore if */
return 404!==e.status?t(e):i();var s=o.dependentDbs,u=n.constructor,a=Object.keys(s).map((function(e){
// use_prefix is only false in the browser
/* istanbul ignore next */
var t=r?e.replace(new RegExp("^"+u.prefix),""):e;return new u(t,n.__opts).destroy()}));Promise.all(a).then(i,t)}))})),He.prototype.execute=function(){var e;if(this.failed)for(;e=this.queue.shift();)e(this.failed);else for(;e=this.queue.shift();)e()},He.prototype.fail=function(e){this.failed=e,this.execute()},He.prototype.ready=function(e){this.isReady=!0,this.db=e,this.execute()},He.prototype.addTask=function(e){this.queue.push(e),this.failed&&this.execute()},l(Xe,Ye);var Ze="undefined"!=typeof AbortController?AbortController:function(){return{abort:function(){}}},et=fetch,tt=Headers;Xe.adapters={},Xe.preferredAdapters=[],Xe.prefix="_pouch_";var nt=new d;
// this would just be "return doc[field]", but fields
// can be "deep" due to dot notation
function rt(e,t){for(var n=e,r=0,i=t.length;r<i&&(n=n[t[r]]);r++);return n}
// Converts a string in dot notation to an array of its components, with backslash escaping
function it(e){for(
// fields may be deep (e.g. "foo.bar.baz"), so parse
var t=[],n="",r=0,i=e.length;r<i;r++){var o=e[r];"."===o?r>0&&"\\"===e[r-1]?// escaped delimiter
n=n.substring(0,n.length-1)+".":(// not escaped, so delimiter
t.push(n),n=""):// normal character
n+=o}return t.push(n),t}!function(e){Object.keys(d.prototype).forEach((function(t){"function"==typeof d.prototype[t]&&(e[t]=nt[t].bind(nt))}));
// these are created in constructor.js, and allow us to notify each DB with
// the same name that it was destroyed, via the constructor object
var t=e._destructionListeners=new o;e.on("ref",(function(e){t.has(e.name)||t.set(e.name,[]),t.get(e.name).push(e)})),e.on("unref",(function(e){if(t.has(e.name)){var n=t.get(e.name),r=n.indexOf(e);r<0||(n.splice(r,1),n.length>1?
/* istanbul ignore next */
t.set(e.name,n):t.delete(e.name))}})),e.on("destroyed",(function(e){if(t.has(e)){var n=t.get(e);t.delete(e),n.forEach((function(e){e.emit("destroyed",!0)}))}}))}(Xe),Xe.adapter=function(e,t,n){
/* istanbul ignore else */
t.valid()&&(Xe.adapters[e]=t,n&&Xe.preferredAdapters.push(e))},Xe.plugin=function(e){if("function"==typeof e)// function style for plugins
e(Xe);else{if("object"!=typeof e||0===Object.keys(e).length)throw new Error('Invalid plugin: got "'+e+'", expected an object or a function');Object.keys(e).forEach((function(t){// object style for plugins
Xe.prototype[t]=e[t]}))}return this.__defaults&&(Xe.__defaults=T({},this.__defaults)),Xe},Xe.defaults=function(e){function t(e,n){if(!(this instanceof t))return new t(e,n);n=n||{},e&&"object"==typeof e&&(e=(n=e).name,delete n.name),n=T({},t.__defaults,n),Xe.call(this,e,n)}return l(t,Xe),t.preferredAdapters=Xe.preferredAdapters.slice(),Object.keys(Xe).forEach((function(e){e in t||(t[e]=Xe[e])})),
// make default options transitive
// https://github.com/pouchdb/pouchdb/issues/5922
t.__defaults=T({},this.__defaults,e),t},Xe.fetch=function(e,t){return et(e,t)};var ot=["$or","$nor","$not"];function st(e){return ot.indexOf(e)>-1}function ut(e){return Object.keys(e)[0]}
// flatten an array of selectors joined by an $and operator
function at(e){
// sort to ensure that e.g. if the user specified
// $and: [{$gt: 'a'}, {$gt: 'b'}], then it's collapsed into
// just {$gt: 'b'}
var t={};return e.forEach((function(e){Object.keys(e).forEach((function(n){var r=e[n];if("object"!=typeof r&&(r={$eq:r}),st(n))t[n]=r instanceof Array?r.map((function(e){return at([e])})):at([r]);else{var i=t[n]=t[n]||{};Object.keys(r).forEach((function(e){var t=r[e];return"$gt"===e||"$gte"===e?
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
(e,t,i):"$lt"===e||"$lte"===e?function(e,t,n){void 0===n.$eq&&(// do nothing
void 0!==n.$lte?"$lte"===e?t<n.$lte&&(// more specificity
n.$lte=t):// operator === '$gt'
t<=n.$lte&&(// more specificity
delete n.$lte,n.$lt=t):void 0!==n.$lt?"$lte"===e?t<n.$lt&&(// more specificity
delete n.$lt,n.$lte=t):// operator === '$gt'
t<n.$lt&&(// more specificity
n.$lt=t):n[e]=t)}
// combine $ne values into one array
(e,t,i):"$ne"===e?function(e,t){"$ne"in t?
// there are many things this could "not" be
t.$ne.push(e):// doesn't exist yet
t.$ne=[e]}
// add $eq into the mix
(t,i):"$eq"===e?function(e,t){
// these all have less specificity than the $eq
// TODO: check for user errors here
delete t.$gt,delete t.$gte,delete t.$lt,delete t.$lte,delete t.$ne,t.$eq=e}
//#7458: execute function mergeAndedSelectors on nested $and
(t,i):void(i[e]=t)}))}}))})),t}function ct(e){for(var t in e){if(Array.isArray(e))for(var n in e)e[n].$and&&(e[n]=at(e[n].$and));var r=e[t];"object"==typeof r&&ct(r)}return e}
//#7458: determine id $and is present in selector (at any level)
function ft(e,t){for(var n in e){"$and"===n&&(t=!0);var r=e[n];"object"==typeof r&&(t=ft(r,t))}return t}
// normalize the selector
function lt(e){var t=w(e),n=!1;
//#7458: if $and is present in selector (at any level) merge nested $and
ft(t,!1)&&("$and"in(t=ct(t))&&(t=at(t.$and)),n=!0),["$or","$nor"].forEach((function(e){e in t&&
// message each individual selector
// e.g. {foo: 'bar'} becomes {foo: {$eq: 'bar'}}
t[e].forEach((function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var r=t[n],i=e[r];"object"==typeof i&&null!==i||(e[r]={$eq:i})}}))})),"$not"in t&&(
//This feels a little like forcing, but it will work for now,
//I would like to come back to this and make the merging of selectors a little more generic
t.$not=at([t.$not]));for(var r=Object.keys(t),i=0;i<r.length;i++){var o=r[i],s=t[o];"object"!=typeof s||null===s?s={$eq:s}:"$ne"in s&&!n&&(
// I put these in an array, since there may be more than one
// but in the "mergeAnded" operation, I already take care of that
s.$ne=[s.$ne]),t[o]=s}return t}// verified by -Number.MIN_VALUE
// set to '_' for easier debugging 
function dt(e,t){if(e===t)return 0;e=ht(e),t=ht(t);var n=gt(e),r=gt(t);if(n-r!=0)return n-r;switch(typeof e){case"number":return e-t;case"boolean":return e<t?-1:1;case"string":return function(e,t){
// See: https://github.com/daleharvey/pouchdb/issues/40
// This is incompatible with the CouchDB implementation, but its the
// best we can do for now
return e===t?0:e>t?1:-1}(e,t)}return Array.isArray(e)?function(e,t){for(var n=Math.min(e.length,t.length),r=0;r<n;r++){var i=dt(e[r],t[r]);if(0!==i)return i}return e.length===t.length?0:e.length>t.length?1:-1}(e,t):function(e,t){for(var n=Object.keys(e),r=Object.keys(t),i=Math.min(n.length,r.length),o=0;o<i;o++){
// First sort the keys
var s=dt(n[o],r[o]);if(0!==s)return s;
// if the keys are equal sort the values
if(0!==(s=dt(e[n[o]],t[r[o]])))return s}return n.length===r.length?0:n.length>r.length?1:-1}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
(e,t)}
// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
function ht(e){switch(typeof e){case"undefined":return null;case"number":return e===1/0||e===-1/0||isNaN(e)?null:e;case"object":var t=e;if(Array.isArray(e)){var n=e.length;e=new Array(n);for(var r=0;r<n;r++)e[r]=ht(t[r]);
/* istanbul ignore next */}else{if(e instanceof Date)return e.toJSON();if(null!==e)for(var i in// generic object
e={},t)if(t.hasOwnProperty(i)){var o=t[i];void 0!==o&&(e[i]=ht(o))}}}return e}
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
var t,n,r=e.toExponential().split(/e\+?/),i=parseInt(r[1],10),o=e<0,s=o?"0":"2",u=(n=function(e,t,n){
/* istanbul ignore next */
for(var r="",i=3-e.length;r.length<i;)r+="0";return r}(t=((o?-i:i)- -324).toString()),n+t);s+=""+u;
// then sort by the factor
var a=Math.abs(parseFloat(r[0]));// [1..10)
/* istanbul ignore next */o&&(// for negative reverse ordering
a=10-a);var c=a.toFixed(20);
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
/* eslint-enable no-control-regex */case"object":var t=Array.isArray(e),n=t?e:Object.keys(e),r=-1,i=n.length,o="";if(t)for(;++r<i;)o+=pt(n[r]);else for(;++r<i;){var s=n[r];o+=pt(s)+pt(e[s])}return o}return""}(e)+"\0"}function vt(e,t){var n,r=t;if("1"===e[t])n=0,t++;else{var i="0"===e[t];t++;var o="",s=e.substring(t,t+3),u=parseInt(s,10)+-324;for(
/* istanbul ignore next */
i&&(u=-u),t+=3;;){var a=e[t];if("\0"===a)break;o+=a,t++}n=1===(o=o.split(".")).length?parseInt(o,10):parseFloat(o[0]+"."+o[1])
/* istanbul ignore next */,i&&(n-=10
/* istanbul ignore next */),0!==u&&(
// parseFloat is more reliable than pow due to rounding errors
// e.g. Number.MAX_VALUE would return Infinity if we did
// num * Math.pow(10, magnitude);
n=parseFloat(n+"e"+u))}return{num:n,length:t-r}}
// move up the stack while parsing
// this function moved outside of parseIndexableString for performance
function yt(e,t){var n=e.pop();if(t.length){var r=t[t.length-1];n===r.element&&(
// popping a meta-element, e.g. an object whose value is another object
t.pop(),r=t[t.length-1]);var i=r.element,o=r.index;Array.isArray(i)?i.push(n):o===e.length-2?i[e.pop()]=n:e.push(n);// obj with key only
}}function gt(e){var t=["boolean","number","string","object"].indexOf(typeof e);
//false if -1 otherwise true, but fast!!!!1
return~t?null===e?1:Array.isArray(e)?5:t<3?t+2:t+3:
/* istanbul ignore next */
Array.isArray(e)?5:void 0}function _t(e,t,n){return n.every((function(n){var r=t[n],i=it(n),o=rt(e,i);return st(n)?function(e,t,n){return"$or"===e?t.some((function(e){return _t(n,e,Object.keys(e))})):"$not"===e?!_t(n,t,Object.keys(t)):!t.find((function(e){return _t(n,e,Object.keys(e))}))}(n,r,e):mt(r,e,i,o)}))}function mt(e,t,n,r){return!e||(
// is matcher an object, if so continue recursion
"object"==typeof e?Object.keys(e).every((function(i){var o=e[i];return function(e,t,n,r,i){if(!jt[e])throw new Error('unknown operator "'+e+'" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');return jt[e](t,n,r,i)}(i,t,o,n,r)})):e===r)}function bt(e){return null!=e}function wt(e){return void 0!==e}function kt(e,t){return t.some((function(t){return e instanceof Array?e.indexOf(t)>-1:e===t}))}var jt={$elemMatch:function(e,t,n,r){return!!Array.isArray(r)&&0!==r.length&&("object"==typeof r[0]?r.some((function(e){return _t(e,t,Object.keys(t))})):r.some((function(r){return mt(t,e,n,r)})))},$allMatch:function(e,t,n,r){return!!Array.isArray(r)&&
/* istanbul ignore next */
0!==r.length&&("object"==typeof r[0]?r.every((function(e){return _t(e,t,Object.keys(t))})):r.every((function(r){return mt(t,e,n,r)})))},$eq:function(e,t,n,r){return wt(r)&&0===dt(r,t)},$gte:function(e,t,n,r){return wt(r)&&dt(r,t)>=0},$gt:function(e,t,n,r){return wt(r)&&dt(r,t)>0},$lte:function(e,t,n,r){return wt(r)&&dt(r,t)<=0},$lt:function(e,t,n,r){return wt(r)&&dt(r,t)<0},$exists:function(e,t,n,r){
//a field that is null is still considered to exist
return t?wt(r):!wt(r)},$mod:function(e,t,n,r){return bt(r)&&function(e,t){var n=t[0],r=t[1];if(0===n)throw new Error("Bad divisor, cannot divide by zero");if(parseInt(n,10)!==n)throw new Error("Divisor is not an integer");if(parseInt(r,10)!==r)throw new Error("Modulus is not an integer");return parseInt(e,10)===e&&e%n===r}(r,t)},$ne:function(e,t,n,r){return t.every((function(e){return 0!==dt(r,e)}))},$in:function(e,t,n,r){return bt(r)&&kt(r,t)},$nin:function(e,t,n,r){return bt(r)&&!kt(r,t)},$size:function(e,t,n,r){return bt(r)&&function(e,t){return e.length===t}(r,t)},$all:function(e,t,n,r){return Array.isArray(r)&&function(e,t){return t.every((function(t){return e.indexOf(t)>-1}))}(r,t)},$regex:function(e,t,n,r){return bt(r)&&function(e,t){return new RegExp(t).test(e)}(r,t)},$type:function(e,t,n,r){return function(e,t){switch(t){case"null":return null===e;case"boolean":return"boolean"==typeof e;case"number":return"number"==typeof e;case"string":return"string"==typeof e;case"array":return e instanceof Array;case"object":return"[object Object]"==={}.toString.call(e)}throw new Error(t+" not supported as a type.Please use one of object, string, array, number, boolean or null.")}(r,t)}};
// return true if the given doc matches the supplied selector
function Ot(e,t){if(e.selector&&e.filter&&"_selector"!==e.filter){var n="string"==typeof e.filter?e.filter:"function";return t(new Error('selector invalid for filter "'+n+'"'))}t()}function St(e){e.view&&!e.filter&&(e.filter="_view"),e.selector&&!e.filter&&(e.filter="_selector"),e.filter&&"string"==typeof e.filter&&("_view"===e.filter?e.view=ie(e.view):e.filter=ie(e.filter))}function Pt(e,t){return t.filter&&"string"==typeof t.filter&&!t.doc_ids&&!ne(e.db)}function At(e,t){var n=t.complete;if("_view"===t.filter){if(!t.view||"string"!=typeof t.view){var r=H(z,"`view` filter parameter not found or invalid.");return n(r)}
// fetch a view from a design doc, make it behave like a filter
var i=re(t.view);e.db.get("_design/"+i[0],(function(r,o){
/* istanbul ignore if */
if(e.isCancelled)return n(null,{status:"cancelled"});
/* istanbul ignore next */if(r)return n(X(r));var s=o&&o.views&&o.views[i[1]]&&o.views[i[1]].map;if(!s)return n(H(I,o.views?"missing json key: "+i[1]:"missing json key: views"));t.filter=fe(["return function(doc) {",'  "use strict";',"  var emitted = false;","  var emit = function (a, b) {","    emitted = true;","  };","  var view = "+s+";","  view(doc);","  if (emitted) {","    return true;","  }","};"].join("\n"),{}),e.doChanges(t)}))}else if(t.selector)t.filter=function(e){return function(e,t){
/* istanbul ignore if */
if("object"!=typeof t)
// match the CouchDB error message
throw new Error("Selector error: expected a JSON object");var n=function(e,t,n){if(e=e.filter((function(e){return _t(e.doc,t.selector,n)})),t.sort){
// in-memory sort
var r=function(e){function t(t){return e.map((function(e){var n=it(ut(e));return rt(t,n)}))}return function(e,n){var r,i,o=dt(t(e.doc),t(n.doc));return 0!==o?o:(r=e.doc._id)<(i=n.doc._id)?-1:r>i?1:0;
// this is what mango seems to do
}}(t.sort);e=e.sort(r),"string"!=typeof t.sort[0]&&"desc"===(i=t.sort[0])[ut(i)]&&(e=e.reverse())}var i;if("limit"in t||"skip"in t){
// have to do the limit in-memory
var o=t.skip||0,s=("limit"in t?t.limit:e.length)+o;e=e.slice(o,s)}return e}([{doc:e}],{selector:t=lt(t)},Object.keys(t));return n&&1===n.length}(e,t.selector)},e.doChanges(t);else{
// fetch a filter from a design doc
var o=re(t.filter);e.db.get("_design/"+o[0],(function(r,i){
/* istanbul ignore if */
if(e.isCancelled)return n(null,{status:"cancelled"});
/* istanbul ignore next */if(r)return n(X(r));var s=i&&i.filters&&i.filters[o[1]];if(!s)return n(H(I,i&&i.filters?"missing json key: "+o[1]:"missing json key: filters"));t.filter=fe('"use strict";\nreturn '+s+";",{}),e.doChanges(t)}))}}function xt(e){return e.reduce((function(e,t){return e[t]=!0,e}),{})}
// List of top level reserved words for doc
// TODO: remove from pouchdb-core (breaking)
Xe.plugin((function(e){e._changesFilterPlugin={validate:Ot,normalize:St,shouldFilter:Pt,filter:At}})),Xe.version="7.2.2";var qt=xt(["_id","_rev","_attachments","_deleted","_revisions","_revs_info","_conflicts","_deleted_conflicts","_local_seq","_rev_tree",
//replication documents
"_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats",
// Specific to Couchbase Sync Gateway
"_removed"]),Et=xt(["_attachments",
//replication documents
"_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats"]);
// List of reserved words that should end up the document
function Ct(e){if(!/^\d+-/.test(e))return H(W);var t=e.indexOf("-"),n=e.substring(0,t),r=e.substring(t+1);return{prefix:parseInt(n,10),id:r}}
// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
function Bt(e,t,n){var r,i,o;n||(n={deterministic_revs:!0});var s={status:"available"};if(e._deleted&&(s.deleted=!0),t)if(e._id||(e._id=Ae()),i=Pe(e,n.deterministic_revs),e._rev){if((o=Ct(e._rev)).error)return o;e._rev_tree=[{pos:o.prefix,ids:[o.id,{status:"missing"},[[i,s,[]]]]}],r=o.prefix+1}else e._rev_tree=[{pos:1,ids:[i,s,[]]}],r=1;else if(e._revisions&&(e._rev_tree=function(e,t){for(var n=e.start-e.ids.length+1,r=e.ids,i=[r[0],t,[]],o=1,s=r.length;o<s;o++)i=[r[o],{status:"missing"},[i]];return[{pos:n,ids:i}]}(e._revisions,s),r=e._revisions.start,i=e._revisions.ids[0]),!e._rev_tree){if((o=Ct(e._rev)).error)return o;r=o.prefix,i=o.id,e._rev_tree=[{pos:r,ids:[i,s,[]]}]}te(e._id),e._rev=r+"-"+i;var u={metadata:{},data:{}};for(var a in e)
/* istanbul ignore else */
if(Object.prototype.hasOwnProperty.call(e,a)){var c="_"===a[0];if(c&&!qt[a]){var f=H(V,a);throw f.message=V.message+": "+a,f}c&&!Et[a]?u.metadata[a.slice(1)]=e[a]:u.data[a]=e[a]}return u}function $t(e,t,n){if(e.stub)return n();"string"==typeof e.data?// input is a base64 string
function(e,t,n){var r=function(e){try{return de(e)}catch(e){return{error:H(F,"Attachment is not a valid base64 string")}}}(e.data);if(r.error)return n(r.error);e.length=r.length,e.data="blob"===t?ye(r,e.content_type):"base64"===t?he(r):r,Oe(r,(function(t){e.digest="md5-"+t,n()}))}(e,t,n):// input is a blob
function(e,t,n){Oe(e.data,(function(r){e.digest="md5-"+r,
// size is for blobs (browser), length is for buffers (node)
e.length=e.data.size||e.data.length||0,"binary"===t?me(e.data,(function(t){e.data=t,n()})):"base64"===t?be(e.data,(function(t){e.data=t,n()})):n()}))}(e,t,n)}function Tt(e,t,n,r,i,s,u,a,c){
// Default to 1000 locally
e=e||1e3;var f=a.new_edits,l=new o,d=0,h=t.length;function p(){++d===h&&c&&c()}t.forEach((function(e,t){if(e._id&&Fe(e._id)){var r=e._deleted?"_removeLocal":"_putLocal";n[r](e,{ctx:i},(function(e,n){s[t]=e||n,p()}))}else{var o=e.metadata.id;l.has(o)?(h--,// duplicate
l.get(o).push([e,t])):l.set(o,[[e,t]])}})),
// in the case of new_edits, the user can provide multiple docs
// with the same id. these need to be processed sequentially
l.forEach((function(t,n){var i=0;function o(){++i<t.length?c():p()}function c(){var c=t[i],l=c[0],d=c[1];if(r.has(n))!function(e,t,n,r,i,o,s,u){if(function(e,t){for(var n,r=e.slice(),i=t.split("-"),o=parseInt(i[0],10),s=i[1];n=r.pop();){if(n.pos===o&&n.ids[0]===s)return!0;for(var u=n.ids[2],a=0,c=u.length;a<c;a++)r.push({pos:n.pos+1,ids:u[a]})}return!1}(t.rev_tree,n.metadata.rev)&&!u)return r[i]=n,o();
// sometimes this is pre-calculated. historically not always
var a=t.winningRev||xe(t),c="deleted"in t?t.deleted:Ue(t,a),f="deleted"in n.metadata?n.metadata.deleted:Ue(n.metadata),l=/^1-/.test(n.metadata.rev);if(c&&!f&&u&&l){var d=n.data;d._rev=a,d._id=n.metadata.id,n=Bt(d,u)}var h=Ne(t.rev_tree,n.metadata.rev_tree[0],e);if(u&&(c&&f&&"new_leaf"!==h.conflicts||!c&&"new_leaf"!==h.conflicts||c&&!f&&"new_branch"===h.conflicts)){var p=H(R);return r[i]=p,o()}var v=n.metadata.rev;n.metadata.rev_tree=h.tree,n.stemmedRevs=h.stemmedRevs||[],
/* istanbul ignore else */
t.rev_map&&(n.metadata.rev_map=t.rev_map);
// recalculate
var y=xe(n.metadata),g=Ue(n.metadata,y),_=c===g?0:c<g?-1:1;s(n,y,g,v===y?g:Ue(n.metadata,v),!0,_,i,o)}(e,r.get(n),l,s,d,o,u,f);else{
// Ensure stemming applies to new writes as well
var h=Ne([],l.metadata.rev_tree[0],e);l.metadata.rev_tree=h.tree,l.stemmedRevs=h.stemmedRevs||[],function(e,t,n){
// Cant insert new deleted documents
var r=xe(e.metadata),i=Ue(e.metadata,r);if("was_delete"in a&&i)return s[t]=H(I,"deleted"),n();
// 4712 - detect whether a new document was inserted with a _rev
var o=f&&function(e){return"missing"===e.metadata.rev_tree[0].ids[1].status}(e);if(o){var c=H(R);return s[t]=c,n()}u(e,r,i,i,!1,i?0:1,t,n)}(l,d,o)}}c()}))}
// IndexedDB requires a versioned database structure, so we use the
// version here to manage migrations.
var Dt="document-store",Lt="by-sequence",It="attach-store",Rt="attach-seq-store",Mt="meta-store",Nt="local-store",Kt="detect-blob-support";
// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
// Keyed by document id
function Ut(e){try{return JSON.stringify(e)}catch(t){
/* istanbul ignore next */
return c.stringify(e)}}function Ft(e){return function(t){var n="unknown_error";t.target&&t.target.error&&(n=t.target.error.name||t.target.error.message),e(H(Q,n,t.type))}}
// Unfortunately, the metadata has to be stringified
// when it is put into the database, because otherwise
// IndexedDB can throw errors for deeply-nested objects.
// Originally we just used JSON.parse/JSON.stringify; now
// we use this custom vuvuzela library that avoids recursion.
// If we could do it all over again, we'd probably use a
// format for the revision trees other than JSON.
function Jt(e,t,n){return{data:Ut(e),winningRev:t,deletedOrLocal:n?"1":"0",seq:e.seq,// highest seq for this doc
id:e.id}}function Vt(e){if(!e)return null;var t=function(e){
// This try/catch guards against stack overflow errors.
// JSON.parse() is faster than vuvuzela.parse() but vuvuzela
// cannot overflow.
try{return JSON.parse(e)}catch(t){
/* istanbul ignore next */
return c.parse(e)}}(e.data);return t.winningRev=e.winningRev,t.deleted="1"===e.deletedOrLocal,t.seq=e.seq,t}
// read the doc back out from the database. we don't store the
// _id or _rev because we already have _doc_id_rev.
function zt(e){if(!e)return e;var t=e._doc_id_rev.lastIndexOf(":");return e._id=e._doc_id_rev.substring(0,t-1),e._rev=e._doc_id_rev.substring(t+1),delete e._doc_id_rev,e}
// Read a blob from the database, encoding as necessary
// and translating from base64 if the IDB doesn't support
// native Blobs
function Gt(e,t,n,r){n?// we have blob support
r(e?"string"!=typeof e?e:ge(e,t):pe([""],{type:t})):// as base64 string
e?"string"!=typeof e?// we have blob support
_e(e,(function(e){r(he(e))})):// no blob support
r(e):r("")}function Qt(e,t,n,r){var i=Object.keys(e._attachments||{});if(!i.length)return r&&r();var o=0;function s(){++o===i.length&&r&&r()}i.forEach((function(r){t.attachments&&t.include_docs?function(e,t){var r=e._attachments[t],i=r.digest;n.objectStore(It).get(i).onsuccess=function(e){r.body=e.target.result.body,s()}}(e,r):(e._attachments[r].stub=!0,s())}))}
// IDB-specific postprocessing necessary because
// we don't know whether we stored a true Blob or
// a base64-encoded string, and if it's a Blob it
// needs to be read outside of the transaction context
function Wt(e,t){return Promise.all(e.map((function(e){if(e.doc&&e.doc._attachments){var n=Object.keys(e.doc._attachments);return Promise.all(n.map((function(n){var r=e.doc._attachments[n];if("body"in r){var i=r.body,o=r.content_type;return new Promise((function(s){Gt(i,o,t,(function(t){e.doc._attachments[n]=T(S(r,["digest","content_type"]),{data:t}),s()}))}))}})))}})))}function Yt(e,t,n){var r=[],i=n.objectStore(Lt),o=n.objectStore(It),s=n.objectStore(Rt),u=e.length;function a(){--u||r.length&&r.forEach((function(e){s.index("digestSeq").count(IDBKeyRange.bound(e+"::",e+"::￿",!1,!1)).onsuccess=function(t){t.target.result||
// orphaned
o.delete(e)}}))}e.forEach((function(e){var n=i.index("_doc_id_rev"),o=t+"::"+e;n.getKey(o).onsuccess=function(e){var t=e.target.result;if("number"!=typeof t)return a();i.delete(t),s.index("seq").openCursor(IDBKeyRange.only(t)).onsuccess=function(e){var t=e.target.result;if(t){var n=t.value.digestSeq.split("::")[0];r.push(n),s.delete(t.primaryKey),t.continue()}else// done
a()}}}))}function Ht(e,t,n){try{return{txn:e.transaction(t,n)}}catch(e){return{error:e}}}var Xt=new E;function Zt(e,t,n,r,i,s){for(var u,a,c,f,l,d,h,p,v=t.docs,y=0,g=v.length;y<g;y++){var _=v[y];_._id&&Fe(_._id)||(_=v[y]=Bt(_,n.new_edits,e)).error&&!h&&(h=_)}if(h)return s(h);var m=!1,b=0,w=new Array(v.length),k=new o,j=!1,O=r._meta.blobSupport?"blob":"base64";function S(){m=!0,P()}function P(){p&&m&&(
// caching the docCount saves a lot of time in allDocs() and
// info(), which is why we go to all the trouble of doing this
p.docCount+=b,d.put(p))}function A(){j||(Xt.notify(r._meta.name),s(null,w))}function x(e,t,n,r,i,o,s,u){e.metadata.winningRev=t,e.metadata.deleted=n;var a=e.data;if(a._id=e.metadata.id,a._rev=e.metadata.rev,r&&(a._deleted=!0),a._attachments&&Object.keys(a._attachments).length)return function(e,t,n,r,i,o){var s=e.data,u=0,a=Object.keys(s._attachments);function c(){u===a.length&&q(e,t,n,r,i,o)}function l(){u++,c()}a.forEach((function(n){var r=e.data._attachments[n];if(r.stub)u++,c();else{var i=r.data;delete r.data,r.revpos=parseInt(t,10),function(e,t,n){f.count(e).onsuccess=function(r){if(r.target.result)return n();// already exists
var i={digest:e,body:t};f.put(i).onsuccess=n}}(r.digest,i,l)}}))}
// map seqs to attachment digests, which
// we will need later during compaction
(e,t,n,i,s,u);b+=o,P(),q(e,t,n,i,s,u)}function q(e,t,n,i,o,s){var f=e.data,d=e.metadata;function h(o){var s=e.stemmedRevs||[];i&&r.auto_compaction&&(s=s.concat(function(e){var t=[];return qe(e.rev_tree,(function(e,n,r,i,o){"available"!==o.status||e||(t.push(n+"-"+r),o.status="missing")})),t}(e.metadata))),s&&s.length&&Yt(s,e.metadata.id,u),d.seq=o.target.result;
// Current _rev is calculated from _rev_tree on read
// delete metadata.rev;
var c=Jt(d,t,n);a.put(c).onsuccess=p}function p(){w[o]={ok:!0,id:d.id,rev:d.rev},k.set(e.metadata.id,e.metadata),function(e,t,n){var r=0,i=Object.keys(e.data._attachments||{});if(!i.length)return n();function o(){++r===i.length&&n()}function s(n){var r=e.data._attachments[n].digest,i=l.put({seq:t,digestSeq:r+"::"+t});i.onsuccess=o,i.onerror=function(e){
// this callback is for a constaint error, which we ignore
// because this docid/rev has already been associated with
// the digest (e.g. when new_edits == false)
e.preventDefault(),// avoid transaction abort
e.stopPropagation(),// avoid transaction onerror
o()}}for(var u=0;u<i.length;u++)s(i[u]);// do in parallel
}(e,d.seq,s)}f._doc_id_rev=d.id+"::"+d.rev,delete f._id,delete f._rev;var v=c.put(f);v.onsuccess=h,v.onerror=function(e){
// ConstraintError, need to update, not put (see #1638 for details)
e.preventDefault(),// avoid transaction abort
e.stopPropagation(),c.index("_doc_id_rev").getKey(f._doc_id_rev).onsuccess=function(e){c.put(f,e.target.result).onsuccess=h}}}!function(e,t,n){if(!e.length)return n();var r,i=0;function o(){i++,e.length===i&&(r?n(r):n())}e.forEach((function(e){var n=e.data&&e.data._attachments?Object.keys(e.data._attachments):[],i=0;if(!n.length)return o();function s(e){r=e,++i===n.length&&o()}for(var u in e.data._attachments)e.data._attachments.hasOwnProperty(u)&&$t(e.data._attachments[u],t,s)}))}(v,O,(function(t){if(t)return s(t);!function(){var t=Ht(i,[Dt,Lt,It,Nt,Rt,Mt],"readwrite");if(t.error)return s(t.error);(u=t.txn).onabort=Ft(s),u.ontimeout=Ft(s),u.oncomplete=A,a=u.objectStore(Dt),c=u.objectStore(Lt),f=u.objectStore(It),l=u.objectStore(Rt),(d=u.objectStore(Mt)).get(Mt).onsuccess=function(e){p=e.target.result,P()},function(e){var t=[];if(v.forEach((function(e){e.data&&e.data._attachments&&Object.keys(e.data._attachments).forEach((function(n){var r=e.data._attachments[n];r.stub&&t.push(r.digest)}))})),!t.length)return e();var n,r=0;function i(){++r===t.length&&e(n)}t.forEach((function(e){!function(e,t){f.get(e).onsuccess=function(n){if(n.target.result)t();else{var r=H(Y,"unknown stub attachment with digest "+e);r.status=412,t(r)}}}(e,(function(e){e&&!n&&(n=e),i()}))}))}((function(t){if(t)return j=!0,s(t);!function(){if(v.length)for(var t=0,i=0,o=v.length;i<o;i++){var s=v[i];s._id&&Fe(s._id)?c():a.get(s.metadata.id).onsuccess=f}function c(){++t===v.length&&Tt(e.revs_limit,v,r,k,u,w,x,n,S)}function f(e){var t=Vt(e.target.result);t&&k.set(t.id,t),c()}}()}))}()}))}
// Abstraction over IDBCursor and getAll()/getAllKeys() that allows us to batch our operations
// while falling back to a normal IDBCursor operation on browsers that don't support getAll() or
// getAllKeys(). This allows for a much faster implementation than just straight-up cursors, because
// we're not processing each document one-at-a-time.
function en(e,t,n,r,i){
// Bail out of getAll()/getAllKeys() in the following cases:
// 1) either method is unsupported - we need both
// 2) batchSize is 1 (might as well use IDBCursor)
// 3) descending – no real way to do this via getAll()/getAllKeys()
var o,s,u;function a(e){s=e.target.result,o&&i(o,s,u)}function c(e){o=e.target.result,s&&i(o,s,u)}function f(e){var t=e.target.result;if(!t)// done
return i();
// regular IDBCursor acts like a batch where batch size is always 1
i([t.key],[t.value],t)}-1===r&&(r=1e3),"function"==typeof e.getAll&&"function"==typeof e.getAllKeys&&r>1&&!n?(u={continue:function(){if(!o.length)// no more results
return i();
// fetch next batch, exclusive start
var n,u=o[o.length-1];if(t&&t.upper)try{n=IDBKeyRange.bound(u,t.upper,!0,t.upperOpen)}catch(e){if("DataError"===e.name&&0===e.code)return i();// we're done, startkey and endkey are equal
}else n=IDBKeyRange.lowerBound(u,!0);t=n,o=null,s=null,e.getAll(t,r).onsuccess=a,e.getAllKeys(t,r).onsuccess=c}},e.getAll(t,r).onsuccess=a,e.getAllKeys(t,r).onsuccess=c):n?e.openCursor(t,"prev").onsuccess=f:e.openCursor(t).onsuccess=f}
// simple shim for objectStore.getAll(), falling back to IDBCursor
function tn(e,t,n){var r,i,o="startkey"in e&&e.startkey,s="endkey"in e&&e.endkey,u="key"in e&&e.key,a="keys"in e&&e.keys,c=e.skip||0,f="number"==typeof e.limit?e.limit:-1,l=!1!==e.inclusive_end;if(!a&&(r=function(e,t,n,r,i){try{if(e&&t)return i?IDBKeyRange.bound(t,e,!n,!1):IDBKeyRange.bound(e,t,!1,!n);if(e)return i?IDBKeyRange.upperBound(e):IDBKeyRange.lowerBound(e);if(t)return i?IDBKeyRange.lowerBound(t,!n):IDBKeyRange.upperBound(t,!n);if(r)return IDBKeyRange.only(r)}catch(e){return{error:e}}return null}(o,s,l,u,e.descending),(i=r&&r.error)&&("DataError"!==i.name||0!==i.code)))
// DataError with error code 0 indicates start is less than end, so
// can just do an empty query. Else need to throw
return n(H(Q,i.name,i.message));var d=[Dt,Lt,Mt];e.attachments&&d.push(It);var h=Ht(t,d,"readonly");if(h.error)return n(h.error);var p=h.txn;p.oncomplete=function(){e.attachments?Wt(w,e.binary).then(S):S()}
// don't bother doing any requests if start > end or limit === 0
,p.onabort=Ft(n);var v,y,g=p.objectStore(Dt),_=p.objectStore(Lt),m=p.objectStore(Mt),b=_.index("_doc_id_rev"),w=[];function k(t,n){var r={id:n.id,key:n.id,value:{rev:t}};n.deleted?a&&(w.push(r),
// deleted docs are okay with "keys" requests
r.value.deleted=!0,r.doc=null):c--<=0&&(w.push(r),e.include_docs&&
// if the user specifies include_docs=true, then we don't
// want to block the main cursor while we're fetching the doc
function(t,n,r){var i=t.id+"::"+r;b.get(i).onsuccess=function(r){if(n.doc=zt(r.target.result)||{},e.conflicts){var i=Be(t);i.length&&(n.doc._conflicts=i)}Qt(n.doc,e,p)}}(n,r,t))}function j(e){for(var t=0,n=e.length;t<n&&w.length!==f;t++){var r=e[t];if(r.error&&a)
// key was not found with "keys" requests
w.push(r);else{var i=Vt(r);k(i.winningRev,i)}}}function O(e,t,n){n&&(j(t),w.length<f&&n.continue())}function S(){var t={total_rows:v,offset:e.skip,rows:w};
/* istanbul ignore if */e.update_seq&&void 0!==y&&(t.update_seq=y),n(null,t)}return m.get(Mt).onsuccess=function(e){v=e.target.result.docCount},
/* istanbul ignore if */
e.update_seq&&function(e,t){e.openCursor(null,"prev").onsuccess=function(e){var t=e.target.result,n=void 0;return t&&t.key&&(n=t.key),function(e){e.target.result&&e.target.result.length>0&&(y=e.target.result[0])}({target:{result:[n]}})}}(_),i||0===f?void 0:a?function(e,t,n){
// It's not guaranted to be returned in right order  
var r=new Array(e.length),i=0;e.forEach((function(o,s){t.get(o).onsuccess=function(t){t.target.result?r[s]=t.target.result:r[s]={key:o,error:"not_found"},++i===e.length&&n(e,r,{})}}))}(e.keys,g,O):-1===f?function(e,t,n){if("function"!=typeof e.getAll){
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
var nn=!1,rn=[];function on(){!nn&&rn.length&&(nn=!0,rn.shift()())}function sn(e,t,n,r){if((e=w(e)).continuous){var s=n+":"+Ae();return Xt.addListener(n,s,t,e),Xt.notify(n),{cancel:function(){Xt.removeListener(n,s)}}}var u=e.doc_ids&&new i(e.doc_ids);e.since=e.since||0;var a=e.since,c="limit"in e?e.limit:-1;0===c&&(c=1);var f,l,d,h,p=[],v=0,y=Z(e),g=new o;function _(e,t,n,r){if(n.seq!==t)
// some other seq is later
return r();if(n.winningRev===e._rev)
// this is the winning doc
return r(n,e);
// fetch winning doc in separate request
var i=e._id+"::"+n.winningRev;h.get(i).onsuccess=function(e){r(n,zt(e.target.result))}}function m(){e.complete(null,{results:p,last_seq:a})}var b=[Dt,Lt];e.attachments&&b.push(It);var k=Ht(r,b,"readonly");if(k.error)return e.complete(k.error);(f=k.txn).onabort=Ft(e.complete),f.oncomplete=function(){!e.continuous&&e.attachments?
// cannot guarantee that postProcessing was already done,
// so do it again
Wt(p).then(m):m()},l=f.objectStore(Lt),d=f.objectStore(Dt),h=l.index("_doc_id_rev"),en(l,e.since&&!e.descending?IDBKeyRange.lowerBound(e.since,!0):null,e.descending,c,(function(t,n,r){if(r&&t.length){var i=new Array(t.length),o=new Array(t.length),s=0;n.forEach((function(n,a){!function(e,t,n){if(u&&!u.has(e._id))return n();var r=g.get(e._id);if(r)// cached
return _(e,t,r,n);
// metadata not cached, have to go fetch it
d.get(e._id).onsuccess=function(i){r=Vt(i.target.result),g.set(e._id,r),_(e,t,r,n)}}(zt(n),t[a],(function(n,u){o[a]=n,i[a]=u,++s===t.length&&function(){for(var t=[],n=0,s=i.length;n<s&&v!==c;n++){var u=i[n];if(u){var a=o[n];t.push(l(a,u))}}Promise.all(t).then((function(t){for(var n=0,r=t.length;n<r;n++)t[n]&&e.onChange(t[n])})).catch(e.complete),v!==c&&r.continue()}
// Fetch all metadatas/winningdocs from this batch in parallel, then process
// them all only once all data has been collected. This is done in parallel
// because it's faster than doing it one-at-a-time.
()}))}))}function l(t,n){var r=e.processChange(n,t,e);a=r.seq=t.seq;var i=y(r);return"object"==typeof i?Promise.reject(i):i?(v++,e.return_docs&&p.push(r),
// process the attachment immediately
// for the benefit of live listeners
e.attachments&&e.include_docs?new Promise((function(t){Qt(n,e,f,(function(){Wt([r],e.binary).then((function(){t(r)}))}))})):Promise.resolve(r)):Promise.resolve()}}))}var un,an=new o,cn=new o;function fn(e,t){var n=this;!function(e,t,n){rn.push((function(){e((function(e,r){!function(e,t,n,r){try{e(t,n)}catch(t){
// Shouldn't happen, but in some odd cases
// IndexedDB implementations might throw a sync
// error, in which case this will at least log it.
r.emit("error",t)}}(t,e,r,n),nn=!1,s((function(){on()}))}))})),on()}((function(t){!function(e,t,n){var r=t.name,i=null;
// called when creating a fresh new database
// migration to version 2
// unfortunately "deletedOrLocal" is a misnomer now that we no longer
// store local docs in the main doc-store, but whaddyagonnado
function o(e,t){var n=e.objectStore(Dt);n.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),n.openCursor().onsuccess=function(e){var r=e.target.result;if(r){var i=r.value,o=Ue(i);i.deletedOrLocal=o?"1":"0",n.put(i),r.continue()}else t()}}
// migration to version 3 (part 1)
// migration to version 3 (part 2)
function u(e,t){var n=e.objectStore(Nt),r=e.objectStore(Dt),i=e.objectStore(Lt);r.openCursor().onsuccess=function(e){var o=e.target.result;if(o){var s=o.value,u=s.id,a=Fe(u),c=xe(s);if(a){var f=u+"::"+c,l=u+"::",d=u+"::~",h=i.index("_doc_id_rev"),p=IDBKeyRange.bound(l,d,!1,!1),v=h.openCursor(p);
// remove all seq entries
// associated with this docId
v.onsuccess=function(e){if(v=e.target.result){var t=v.value;t._doc_id_rev===f&&n.put(t),i.delete(v.primaryKey),v.continue()}else
// done
r.delete(o.primaryKey),o.continue()}}else o.continue()}else t&&t()}}
// migration to version 4 (part 1)
// migration to version 4 (part 2)
function a(e,t){var n=e.objectStore(Lt),r=e.objectStore(It),i=e.objectStore(Rt);r.count().onsuccess=function(e){if(!e.target.result)return t();// done
n.openCursor().onsuccess=function(e){var n=e.target.result;if(!n)return t();// done
for(var r=n.value,o=n.primaryKey,s=Object.keys(r._attachments||{}),u={},a=0;a<s.length;a++)u[r._attachments[s[a]].digest]=!0;var c=Object.keys(u);for(a=0;a<c.length;a++){var f=c[a];i.put({seq:o,digestSeq:f+"::"+o})}n.continue()}}}
// migration to version 5
// Instead of relying on on-the-fly migration of metadata,
// this brings the doc-store to its modern form:
// - metadata.winningrev
// - metadata.seq
// - stringify the metadata when storing it
function c(e){
// ensure that every metadata has a winningRev and seq,
// which was previously created on-the-fly but better to migrate
var t=e.objectStore(Lt),n=e.objectStore(Dt);n.openCursor().onsuccess=function(e){var r=e.target.result;if(r){var i=function(e){return e.data?Vt(e):(
// old format, when we didn't store it stringified
e.deleted="1"===e.deletedOrLocal,e)}(r.value);if(i.winningRev=i.winningRev||xe(i),i.seq)return o();!function(){
// metadata.seq was added post-3.2.0, so if it's missing,
// we need to fetch it manually
var e=i.id+"::",n=i.id+"::￿",r=t.index("_doc_id_rev").openCursor(IDBKeyRange.bound(e,n)),s=0;r.onsuccess=function(e){var t=e.target.result;if(!t)return i.seq=s,o();var n=t.primaryKey;n>s&&(s=n),t.continue()}}()}function o(){var e=Jt(i,i.winningRev,i.deleted);n.put(e).onsuccess=function(){r.continue()}}}}e._meta=null,e._remote=!1,e.type=function(){return"idb"},e._id=j((function(t){t(null,e._meta.instanceId)})),e._bulkDocs=function(n,r,o){Zt(t,n,r,e,i,o)},
// First we look up the metadata in the ids database, then we fetch the
// current revision(s) from the by sequence store
e._get=function(e,t,n){var r,o,s,u=t.ctx;if(!u){var a=Ht(i,[Dt,Lt,It],"readonly");if(a.error)return n(a.error);u=a.txn}function c(){n(s,{doc:r,metadata:o,ctx:u})}u.objectStore(Dt).get(e).onsuccess=function(e){
// we can determine the result here if:
// 1. there is no such document
// 2. the document is deleted and we don't ask about specific rev
// When we ask with opts.rev we expect the answer to be either
// doc (possibly with _deleted=true) or missing error
if(!(o=Vt(e.target.result)))return s=H(I,"missing"),c();var n;if(t.rev)n=t.latest?function(e,t){for(var n,r=t.rev_tree.slice();n=r.pop();){var i=n.pos,o=n.ids,s=o[0],u=o[1],a=o[2],c=0===a.length,f=n.history?n.history.slice():[];if(f.push({id:s,pos:i,opts:u}),c)for(var l=0,d=f.length;l<d;l++){var h=f[l];if(h.pos+"-"+h.id===e)
// return the rev of this leaf
return i+"-"+s}for(var p=0,v=a.length;p<v;p++)r.push({pos:i+1,ids:a[p],history:f})}
/* istanbul ignore next */throw new Error("Unable to resolve latest revision for id "+t.id+", rev "+e)}(t.rev,o):t.rev;else if(n=o.winningRev,Ue(o))return s=H(I,"deleted"),c();var i=u.objectStore(Lt),a=o.id+"::"+n;i.index("_doc_id_rev").get(a).onsuccess=function(e){if((r=e.target.result)&&(r=zt(r)),!r)return s=H(I,"missing"),c();c()}}},e._getAttachment=function(e,t,n,r,o){var s;if(r.ctx)s=r.ctx;else{var u=Ht(i,[Dt,Lt,It],"readonly");if(u.error)return o(u.error);s=u.txn}var a=n.digest,c=n.content_type;s.objectStore(It).get(a).onsuccess=function(e){Gt(e.target.result.body,c,r.binary,(function(e){o(null,e)}))}},e._info=function(t){var n,r,o=Ht(i,[Mt,Lt],"readonly");if(o.error)return t(o.error);var s=o.txn;s.objectStore(Mt).get(Mt).onsuccess=function(e){r=e.target.result.docCount},s.objectStore(Lt).openCursor(null,"prev").onsuccess=function(e){var t=e.target.result;n=t?t.key:0},s.oncomplete=function(){t(null,{doc_count:r,update_seq:n,
// for debugging
idb_attachment_format:e._meta.blobSupport?"binary":"base64"})}},e._allDocs=function(e,t){tn(e,i,t)},e._changes=function(t){return sn(t,e,r,i)},e._close=function(e){
// https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
// "Returns immediately and closes the connection in a separate thread..."
i.close(),an.delete(r),e()},e._getRevisionTree=function(e,t){var n=Ht(i,[Dt],"readonly");if(n.error)return t(n.error);n.txn.objectStore(Dt).get(e).onsuccess=function(e){var n=Vt(e.target.result);n?t(null,n.rev_tree):t(H(I))}},
// This function removes revisions of document docId
// which are listed in revs and sets this document
// revision to to rev_tree
e._doCompaction=function(e,t,n){var r=Ht(i,[Dt,Lt,It,Rt],"readwrite");if(r.error)return n(r.error);var o=r.txn;o.objectStore(Dt).get(e).onsuccess=function(n){var r=Vt(n.target.result);qe(r.rev_tree,(function(e,n,r,i,o){var s=n+"-"+r;-1!==t.indexOf(s)&&(o.status="missing")})),Yt(t,e,o);var i=r.winningRev,s=r.deleted;o.objectStore(Dt).put(Jt(r,i,s))},o.onabort=Ft(n),o.oncomplete=function(){n()}},e._getLocal=function(e,t){var n=Ht(i,[Nt],"readonly");if(n.error)return t(n.error);var r=n.txn.objectStore(Nt).get(e);r.onerror=Ft(t),r.onsuccess=function(e){var n=e.target.result;n?(delete n._doc_id_rev,// for backwards compat
t(null,n)):t(H(I))}},e._putLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),delete e._revisions;// ignore this, trust the rev
var r=e._rev,o=e._id;e._rev=r?"0-"+(parseInt(r.split("-")[1],10)+1):"0-1";var s,u=t.ctx;if(!u){var a=Ht(i,[Nt],"readwrite");if(a.error)return n(a.error);(u=a.txn).onerror=Ft(n),u.oncomplete=function(){s&&n(null,s)}}var c,f=u.objectStore(Nt);r?(c=f.get(o)).onsuccess=function(i){var o=i.target.result;o&&o._rev===r?f.put(e).onsuccess=function(){s={ok:!0,id:e._id,rev:e._rev},t.ctx&&// return immediately
n(null,s)}:n(H(R))}:(// new doc
(c=f.add(e)).onerror=function(e){
// constraint error, already exists
n(H(R)),e.preventDefault(),// avoid transaction abort
e.stopPropagation()},c.onsuccess=function(){s={ok:!0,id:e._id,rev:e._rev},t.ctx&&// return immediately
n(null,s)})},e._removeLocal=function(e,t,n){"function"==typeof t&&(n=t,t={});var r,o=t.ctx;if(!o){var s=Ht(i,[Nt],"readwrite");if(s.error)return n(s.error);(o=s.txn).oncomplete=function(){r&&n(null,r)}}var u=e._id,a=o.objectStore(Nt),c=a.get(u);c.onerror=Ft(n),c.onsuccess=function(i){var o=i.target.result;o&&o._rev===e._rev?(a.delete(u),r={ok:!0,id:u,rev:"0-0"},t.ctx&&// return immediately
n(null,r)):n(H(I))}},e._destroy=function(e,t){Xt.removeAllListeners(r);
//Close open request for "dbName" database to fix ie delay.
var n=cn.get(r);n&&n.result&&(n.result.close(),an.delete(r));var i=indexedDB.deleteDatabase(r);i.onsuccess=function(){
//Remove open request from the list.
cn.delete(r),q()&&r in localStorage&&delete localStorage[r],t(null,{ok:!0})},i.onerror=Ft(t)};var f=an.get(r);if(f)return i=f.idb,e._meta=f.global,s((function(){n(null,e)}));var l=indexedDB.open(r,5);cn.set(r,l),l.onupgradeneeded=function(e){var t=e.target.result;if(e.oldVersion<1)return function(e){var t=e.createObjectStore(Dt,{keyPath:"id"});e.createObjectStore(Lt,{autoIncrement:!0}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0}),e.createObjectStore(It,{keyPath:"digest"}),e.createObjectStore(Mt,{keyPath:"id",autoIncrement:!1}),e.createObjectStore(Kt),
// added in v2
t.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),
// added in v3
e.createObjectStore(Nt,{keyPath:"_id"});
// added in v4
var n=e.createObjectStore(Rt,{autoIncrement:!0});n.createIndex("seq","seq"),n.createIndex("digestSeq","digestSeq",{unique:!0})}(t);// new db, initial schema
// do migrations
var n=e.currentTarget.transaction;
// these migrations have to be done in this function, before
// control is returned to the event loop, because IndexedDB
e.oldVersion<3&&function(e){e.createObjectStore(Nt,{keyPath:"_id"}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0})}(t),e.oldVersion<4&&function(e){var t=e.createObjectStore(Rt,{autoIncrement:!0});t.createIndex("seq","seq"),t.createIndex("digestSeq","digestSeq",{unique:!0})}(t);var r=[o,// v1 -> v2
u,// v2 -> v3
a,// v3 -> v4
c],i=e.oldVersion;!function e(){var t=r[i-1];i++,t&&t(n,e)}()},l.onsuccess=function(t){(i=t.target.result).onversionchange=function(){i.close(),an.delete(r)},i.onabort=function(e){C("error","Database has a global failure",e.target.error),i.close(),an.delete(r)};
// Do a few setup operations (in parallel as much as possible):
// 1. Fetch meta doc
// 2. Check blob support
// 3. Calculate docCount
// 4. Generate an instanceId if necessary
// 5. Store docCount and instanceId on meta doc
var o,s,u,a,c=i.transaction([Mt,Kt,Dt],"readwrite"),f=!1;function l(){void 0!==u&&f&&(e._meta={name:r,instanceId:a,blobSupport:u},an.set(r,{idb:i,global:e._meta}),n(null,e))}function d(){if(void 0!==s&&void 0!==o){var e=r+"_id";e in o?a=o[e]:o[e]=a=Ae(),o.docCount=s,c.objectStore(Mt).put(o)}}
// fetch or generate the instanceId
c.objectStore(Mt).get(Mt).onsuccess=function(e){o=e.target.result||{id:Mt},d()},
// countDocs
function(e,t){e.objectStore(Dt).index("deletedOrLocal").count(IDBKeyRange.only("0")).onsuccess=function(e){!function(e){s=e,d()}(e.target.result)}}(c),
// check blob support
un||(
// make sure blob support is only checked once
un=function(e){return new Promise((function(t){var n=pe([""]),r=e.objectStore(Kt).put(n,"key");r.onsuccess=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),n=navigator.userAgent.match(/Edge\//);
// MS Edge pretends to be Chrome 42:
// https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
t(n||!e||parseInt(e[1],10)>=43)},r.onerror=e.onabort=function(e){
// If the transaction aborts now its due to not being able to
// write to the database, likely due to the disk being full
e.preventDefault(),e.stopPropagation(),t(!1)}})).catch((function(){return!1;// error, so assume unsupported
}))}(c)),un.then((function(e){u=e,l()})),
// only when the metadata put transaction has completed,
// consider the setup done
c.oncomplete=function(){f=!0,l()},c.onabort=Ft(n)},l.onerror=function(e){var t=e.target.error&&e.target.error.message;t?-1!==t.indexOf("stored database is a higher version")&&(t=new Error('This DB was created with the newer "indexeddb" adapter, but you are trying to open it with the older "idb" adapter')):t="Failed to open indexedDB, are you in private browsing mode?",C("error",t),n(H(Q,t))}}(n,e,t)}),t,n.constructor)}fn.valid=function(){
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
var r=this,i=function(e,t){
// encode db name if opts.prefix is a url (#5574)
if(function(e){if(!e.prefix)return!1;var t=ce(e.prefix).protocol;return"http"===t||"https"===t}(t)){var n=t.name.substr(t.prefix.length);
// Ensure prefix has a trailing slash
e=t.prefix.replace(/\/?$/,"/")+encodeURIComponent(n)}var r=ce(e);(r.user||r.password)&&(r.auth={username:r.user,password:r.password});
// Split the path part of the URI into parts using '/' as the delimiter
// after removing any leading '/' and any trailing '/'
var i=r.path.replace(/(^\/|\/$)/g,"").split("/");return r.db=i.pop(),
// Prevent double encoding of URI component
-1===r.db.indexOf("%")&&(r.db=encodeURIComponent(r.db)),r.path=i.join("/"),r}(e.name,e),o=yn(i,"");e=w(e);var u,a=function(t,n){if((n=n||{}).headers=n.headers||new tt,n.credentials="include",e.auth||i.auth){var r=e.auth||i.auth,o=r.username+":"+r.password,s=he(unescape(encodeURIComponent(o)));n.headers.set("Authorization","Basic "+s)}var u=e.headers||{};return Object.keys(u).forEach((function(e){n.headers.append(e,u[e])})),
/* istanbul ignore if */
function(e){var t="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",n=-1!==t.indexOf("msie"),r=-1!==t.indexOf("trident"),i=-1!==t.indexOf("edge"),o=!("method"in e)||"GET"===e.method;return(n||r||i)&&o}(n)&&(t+=(-1===t.indexOf("?")?"?":"&")+"_nonce="+Date.now()),(e.fetch||et)(t,n)};function c(e,t){return O(e,f((function(e){d().then((function(){return t.apply(this,e)})).catch((function(t){e.pop()(t)}))}))).bind(r)}function l(e,t,n){var r={};return(t=t||{}).headers=t.headers||new tt,t.headers.get("Content-Type")||t.headers.set("Content-Type","application/json"),t.headers.get("Accept")||t.headers.set("Accept","application/json"),a(e,t).then((function(e){return r.ok=e.ok,r.status=e.status,e.json()})).then((function(e){if(r.data=e,!r.ok){r.data.status=r.status;var t=X(r.data);if(n)return n(t);throw t}if(Array.isArray(r.data)&&(r.data=r.data.map((function(e){return e.error||e.missing?X(e):e}))),!n)return r;n(null,r.data)}))}function d(){return e.skip_setup?Promise.resolve():
// If there is a setup in process or previous successful setup
// done then we will use that
// If previous setups have been rejected we will try again
u||((u=l(o).catch((function(e){return e&&e.status&&404===e.status?(
// Doesnt exist, create it
$(404,"PouchDB is just detecting if the remote exists."),l(o,{method:"PUT"})):Promise.reject(e)})).catch((function(e){
// If we try to create a database that already exists, skipped in
// istanbul since its catching a race condition.
/* istanbul ignore if */
return!(!e||!e.status||412!==e.status)||Promise.reject(e)}))).catch((function(){u=null})),u)}function h(e){return e.split("/").map(encodeURIComponent).join("/")}
// Get the attachment
s((function(){t(null,r)})),r._remote=!0,
/* istanbul ignore next */
r.type=function(){return"http"},r.id=c("id",(function(e){a(gn(i,"")).then((function(e){return e.json()})).catch((function(){return{}})).then((function(t){
// Bad response or missing `uuid` should not prevent ID generation.
var n=t&&t.uuid?t.uuid+i.db:yn(i,"");e(null,n)}))})),
// Sends a POST request to the host calling the couchdb _compact function
//    version: The version of CouchDB it is running
r.compact=c("compact",(function(e,t){"function"==typeof e&&(t=e,e={}),e=w(e),l(yn(i,"_compact"),{method:"POST"}).then((function(){
// Ping the http if it's finished compaction
!function n(){r.info((function(r,i){
// CouchDB may send a "compact_running:true" if it's
// already compacting. PouchDB Server doesn't.
/* istanbul ignore else */
i&&!i.compact_running?t(null,{ok:!0}):setTimeout(n,e.interval||200)}))}()}))})),r.bulkGet=O("bulkGet",(function(e,t){var n=this;function r(t){var n={};e.revs&&(n.revs=!0),e.attachments&&(
/* istanbul ignore next */n.attachments=!0),e.latest&&(n.latest=!0),l(yn(i,"_bulk_get"+_n(n)),{method:"POST",body:JSON.stringify({docs:e.docs})}).then((function(n){e.attachments&&e.binary&&n.data.results.forEach((function(e){e.docs.forEach(hn)})),t(null,n.data)})).catch(t)}
/* istanbul ignore next */function o(){
// avoid "url too long error" by splitting up into multiple requests
var r=Math.ceil(e.docs.length/50),i=0,o=new Array(r);function s(e){return function(n,s){
// err is impossible because shim returns a list of errs in that case
o[e]=s.results,++i===r&&t(null,{results:ee(o)})}}for(var u=0;u<r;u++){var a=S(e,["revs","attachments","binary","latest"]);a.docs=e.docs.slice(50*u,Math.min(e.docs.length,50*(u+1))),x(n,a,s(u))}}
// mark the whole database as either supporting or not supporting _bulk_get
var s=gn(i,""),u=dn[s];
/* istanbul ignore next */"boolean"!=typeof u?
// check if this database supports _bulk_get
r((function(e,n){e?(dn[s]=!1,$(e.status,"PouchDB is just detecting if the remote supports the _bulk_get API."),o()):(dn[s]=!0,t(null,n))})):u?r(t):o()})),
// Calls GET on the host, which gets back a JSON string containing
//    couchdb: A welcome string
//    version: The version of CouchDB it is running
r._info=function(e){d().then((function(){return a(yn(i,""))})).then((function(e){return e.json()})).then((function(t){t.host=yn(i,""),e(null,t)})).catch(e)},r.fetch=function(e,t){return d().then((function(){var n="/"===e.substring(0,1)?gn(i,e.substring(1)):yn(i,e);return a(n,t)}))},
// Get the document with the given id from the database given by host.
// The id could be solely the _id in the database, or it may be a
// _design/ID or _local/ID path
r.get=c("get",(function(e,t,n){
// If no options were given, set the callback to the second parameter
"function"==typeof t&&(n=t,t={});
// List of parameters to add to the GET request
var r={};function o(e){var n=e._attachments,r=n&&Object.keys(n);if(n&&r.length)
// This limits the number of parallel xhr requests to 5 any time
// to avoid issues with maximum browser request limits
// dead simple promise pool, inspired by https://github.com/timdp/es6-promise-pool
// but much smaller in code size. limits the number of concurrent promises that are executed
return function(e,t){return new Promise((function(t,n){var r,i=0,o=0,s=0,u=e.length;function a(){++s===u?
/* istanbul ignore if */
r?n(r):t():l()}function c(){i--,a()}
/* istanbul ignore next */function f(e){i--,r=r||e,a()}function l(){for(;i<5&&o<u;)i++,e[o++]().then(c,f)}l()}))}(r.map((function(r){return function(){
// we fetch these manually in separate XHRs, because
// Sync Gateway would normally send it back as multipart/mixed,
// which we cannot parse. Also, this is more efficient than
// receiving attachments as base64-encoded strings.
return function(r){var o=n[r],s=pn(e._id)+"/"+h(r)+"?rev="+e._rev;return a(yn(i,s)).then((function(e){return"buffer"in e?e.buffer():e.blob()})).then((function(e){if(t.binary){var n=Object.getOwnPropertyDescriptor(e.__proto__,"type");return n&&!n.set||(e.type=o.content_type),e}return new Promise((function(t){be(e,t)}))})).then((function(e){delete o.stub,delete o.length,o.data=e}))}(r)}})))}(t=w(t)).revs&&(r.revs=!0),t.revs_info&&(r.revs_info=!0),t.latest&&(r.latest=!0),t.open_revs&&("all"!==t.open_revs&&(t.open_revs=JSON.stringify(t.open_revs)),r.open_revs=t.open_revs),t.rev&&(r.rev=t.rev),t.conflicts&&(r.conflicts=t.conflicts
/* istanbul ignore if */),t.update_seq&&(r.update_seq=t.update_seq),e=pn(e),l(yn(i,e+_n(r))).then((function(e){return Promise.resolve().then((function(){if(t.attachments)return n=e.data,Array.isArray(n)?Promise.all(n.map((function(e){if(e.ok)return o(e.ok)}))):o(n);var n})).then((function(){n(null,e.data)}))})).catch((function(t){t.docId=e,n(t)}))})),
// Delete the document given by doc from the database given by host.
r.remove=c("remove",(function(e,t,n,r){var o;"string"==typeof t?(
// id, rev, opts, callback style
o={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(
// doc, opts, callback style
o=e,"function"==typeof t?(r=t,n={}):(r=n,n=t));var s=o._rev||n.rev;l(yn(i,pn(o._id))+"?rev="+s,{method:"DELETE"},r).catch(r)})),r.getAttachment=c("getAttachment",(function(e,t,r,o){"function"==typeof r&&(o=r,r={});var s,u=r.rev?"?rev="+r.rev:"",c=yn(i,pn(e))+"/"+h(t)+u;a(c,{method:"GET"}).then((function(e){if(s=e.headers.get("content-type"),e.ok)return void 0===n||n.browser||"function"!=typeof e.buffer?e.blob():e.buffer();throw e})).then((function(e){
// TODO: also remove
void 0===n||n.browser||(e.type=s),o(null,e)})).catch((function(e){o(e)}))})),
// Remove the attachment given by the id and rev
r.removeAttachment=c("removeAttachment",(function(e,t,n,r){l(yn(i,pn(e)+"/"+h(t))+"?rev="+n,{method:"DELETE"},r).catch(r)})),
// Add the attachment given by blob and its contentType property
// to the document with the given id, the revision given by rev, and
// add it to the database given by host.
r.putAttachment=c("putAttachment",(function(e,t,n,r,o,s){"function"==typeof o&&(s=o,o=r,r=n,n=null);var u=pn(e)+"/"+h(t),a=yn(i,u);if(n&&(a+="?rev="+n),"string"==typeof r){
// input is assumed to be a base64 string
var c;try{c=de(r)}catch(e){return s(H(F,"Attachment is not a valid base64 string"))}r=c?ye(c,o):""}
// Add the attachment
l(a,{headers:new tt({"Content-Type":o}),method:"PUT",body:r},s).catch(s)})),
// Update/create multiple documents given by req in the database
// given by host.
r._bulkDocs=function(e,t,n){
// If new_edits=false then it prevents the database from creating
// new revision numbers for the documents. Instead it just uses
// the old ones. This is used in database replication.
e.new_edits=t.new_edits,d().then((function(){return Promise.all(e.docs.map(vn))})).then((function(){
// Update/create the documents
return l(yn(i,"_bulk_docs"),{method:"POST",body:JSON.stringify(e)},n)})).catch(n)},
// Update/create document
r._put=function(e,t,n){d().then((function(){return vn(e)})).then((function(){return l(yn(i,pn(e._id)),{method:"PUT",body:JSON.stringify(e)})})).then((function(e){n(null,e.data)})).catch((function(t){t.docId=e&&e._id,n(t)}))},
// Get a listing of the documents in the database given
// by host and ordered by increasing id.
r.allDocs=c("allDocs",(function(e,t){"function"==typeof e&&(t=e,e={});
// List of parameters to add to the GET request
var n,r={},o="GET";(e=w(e)).conflicts&&(r.conflicts=!0
/* istanbul ignore if */),e.update_seq&&(r.update_seq=!0),e.descending&&(r.descending=!0),e.include_docs&&(r.include_docs=!0),
// added in CouchDB 1.6.0
e.attachments&&(r.attachments=!0),e.key&&(r.key=JSON.stringify(e.key)),e.start_key&&(e.startkey=e.start_key),e.startkey&&(r.startkey=JSON.stringify(e.startkey)),e.end_key&&(e.endkey=e.end_key),e.endkey&&(r.endkey=JSON.stringify(e.endkey)),void 0!==e.inclusive_end&&(r.inclusive_end=!!e.inclusive_end),void 0!==e.limit&&(r.limit=e.limit),void 0!==e.skip&&(r.skip=e.skip);var s=_n(r);void 0!==e.keys&&(o="POST",n={keys:e.keys}),l(yn(i,"_all_docs"+s),{method:o,body:JSON.stringify(n)}).then((function(n){e.include_docs&&e.attachments&&e.binary&&n.data.rows.forEach(hn),t(null,n.data)})).catch(t)})),
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
/* istanbul ignore if */),"heartbeat"in e&&e.heartbeat&&n-e.heartbeat<ln&&(n=e.heartbeat+ln);var r={};"timeout"in e&&e.timeout&&(r.timeout=e.timeout);var o=void 0!==e.limit&&e.limit,u=o;
// If opts.query_params exists, pass it through to the changes request.
// These parameters may be used by the filter on the source database.
if(e.style&&(r.style=e.style),(e.include_docs||e.filter&&"function"==typeof e.filter)&&(r.include_docs=!0),e.attachments&&(r.attachments=!0),e.continuous&&(r.feed="longpoll"),e.seq_interval&&(r.seq_interval=e.seq_interval),e.conflicts&&(r.conflicts=!0),e.descending&&(r.descending=!0
/* istanbul ignore if */),e.update_seq&&(r.update_seq=!0),"heartbeat"in e&&e.heartbeat&&(r.heartbeat=e.heartbeat),e.filter&&"string"==typeof e.filter&&(r.filter=e.filter),e.view&&"string"==typeof e.view&&(r.filter="_view",r.view=e.view),e.query_params&&"object"==typeof e.query_params)for(var a in e.query_params)
/* istanbul ignore else */
e.query_params.hasOwnProperty(a)&&(r[a]=e.query_params[a]);var c,f="GET";e.doc_ids?(
// set this automagically for the user; it's annoying that couchdb
// requires both a "filter" and a "doc_ids" param.
r.filter="_doc_ids",f="POST",c={doc_ids:e.doc_ids}):e.selector&&(
// set this automagically for the user, similar to above
r.filter="_selector",f="POST",c={selector:e.selector});var h,p=new Ze,v=function(n,s){if(!e.aborted){r.since=n,
// "since" can be any kind of json object in Cloudant/CouchDB 2.x
/* istanbul ignore next */
"object"==typeof r.since&&(r.since=JSON.stringify(r.since)),e.descending?o&&(r.limit=u):r.limit=!o||u>t?t:u;
// Set the options for the ajax call
var a=yn(i,"_changes"+_n(r)),v={signal:p.signal,method:f,body:JSON.stringify(c)};h=n,
/* istanbul ignore if */
e.aborted||
// Get the changes
d().then((function(){return l(a,v,s)})).catch(s)}},y={results:[]},g=function(n,r){if(!e.aborted){var i=0;
// If the result of the ajax call (res) contains changes (res.results)
if(r&&r.results){i=r.results.length,y.last_seq=r.last_seq;var a=null,c=null;
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */"number"==typeof r.pending&&(a=r.pending),"string"!=typeof y.last_seq&&"number"!=typeof y.last_seq||(c=y.last_seq),e.query_params,r.results=r.results.filter((function(t){u--;var n=Z(e)(t);return n&&(e.include_docs&&e.attachments&&e.binary&&hn(t),e.return_docs&&y.results.push(t),e.onChange(t,a,c)),n}))}else if(n)
// In case of an error, stop listening for changes and call
// opts.complete
return e.aborted=!0,void e.complete(n);
// The changes feed may have timed out with no results
// if so reuse last update sequence
r&&r.last_seq&&(h=r.last_seq);var f=o&&u<=0||r&&i<t||e.descending;(!e.continuous||o&&u<=0)&&f?
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
l(yn(i,"_revs_diff"),{method:"POST",body:JSON.stringify(e)},n).catch(n)})),r._close=function(e){e()},r._destroy=function(e,t){l(yn(i,""),{method:"DELETE"}).then((function(e){t(null,e)})).catch((function(e){
/* istanbul ignore if */
404===e.status?t(null,{ok:!0}):t(e)}))}}
// HttpPouch is a valid adapter.
function bn(e){this.status=400,this.name="query_parse_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,bn)}catch(e){}}function wn(e){this.status=404,this.name="not_found",this.message=e,this.error=!0;try{Error.captureStackTrace(this,wn)}catch(e){}}function kn(e){this.status=500,this.name="invalid_value",this.message=e,this.error=!0;try{Error.captureStackTrace(this,kn)}catch(e){}}function jn(e,t){return t&&e.then((function(e){s((function(){t(null,e)}))}),(function(e){s((function(){t(e)}))})),e}function On(e,t){return function(){var n=arguments,r=this;return e.add((function(){return t.apply(r,n)}))}}
// uniq an array of strings, order not guaranteed
// similar to underscore/lodash _.uniq
function Sn(e){var t=new i(e),n=new Array(t.size),r=-1;return t.forEach((function(e){n[++r]=e})),n}function Pn(e){var t=new Array(e.size),n=-1;return e.forEach((function(e,r){t[++n]=r})),t}function An(e){return new kn("builtin "+e+" function requires map values to be numbers or number arrays")}function xn(e){for(var t=0,n=0,r=e.length;n<r;n++){var i=e[n];if("number"!=typeof i){if(!Array.isArray(i))// not array/number
throw An("_sum");
// lists of numbers are also allowed, sum them separately
t="number"==typeof t?[t]:t;for(var o=0,s=i.length;o<s;o++){var u=i[o];if("number"!=typeof u)throw An("_sum");void 0===t[o]?t.push(u):t[o]+=u}}else"number"==typeof t?t+=i:// add number to array
t[0]+=i}return t}mn.valid=function(){return!0},l(bn,Error),l(wn,Error),l(kn,Error);var qn=C.bind(null,"log"),En=Array.isArray,Cn=JSON.parse;function Bn(e,t){return fe("return ("+e.replace(/;\s*$/,"")+");",{emit:t,sum:xn,log:qn,isArray:En,toJSON:Cn})}
/*
 * Simple task queue to sequentialize actions. Assumes
 * callbacks will eventually fire (once).
 */function $n(){this.promise=new Promise((function(e){e()}))}function Tn(e){if(!e)return"undefined";// backwards compat for empty reduce
// for backwards compat with mapreduce, functions/strings are stringified
// as-is. everything else is JSON-stringified.
switch(typeof e){case"function":case"string":
// e.g. a mapreduce built-in _reduce function
return e.toString();default:
// e.g. a JSON object in the case of mango queries
return JSON.stringify(e)}}
/* create a string signature for a view so we can cache it and uniq it */function Dn(e,t,n,r,i,o){var s,u=function(e,t){
// the "undefined" part is for backwards compatibility
return Tn(e)+Tn(t)+"undefined"}(n,r);if(!i&&
// cache this to ensure we don't try to update the same view twice
(s=e._cachedViews=e._cachedViews||{})[u])return s[u];var a=e.info().then((function(a){var c=a.db_name+"-mrview-"+(i?"temp":Se(u));
// save the view name in the source db so it can be cleaned up if necessary
// (e.g. when the _design doc is deleted, remove all associated view data)
return le(e,"_local/"+o,(function(e){e.views=e.views||{};var n=t;-1===n.indexOf("/")&&(n=t+"/"+t);var r=e.views[n]=e.views[n]||{};
/* istanbul ignore if */if(!r[c])return r[c]=!0,e})).then((function(){return e.registerDependentDatabase(c).then((function(t){var i=t.db;i.auto_compaction=!0;var o={name:c,db:i,sourceDB:e,adapter:e.adapter,mapFun:n,reduceFun:r};return o.db.get("_local/lastSeq").catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e})).then((function(e){return o.seq=e?e.seq:0,s&&o.db.once("destroyed",(function(){delete s[u]})),o}))}))}))}));return s&&(s[u]=a),a}$n.prototype.add=function(e){return this.promise=this.promise.catch((function(){
// just recover
})).then((function(){return e()})),this.promise},$n.prototype.finish=function(){return this.promise};var Ln={},In=new $n;function Rn(e){
// can be either 'ddocname/viewname' or just 'viewname'
// (where the ddoc name is the same)
return-1===e.indexOf("/")?[e,e]:e.split("/")}function Mn(e,t){try{e.emit("error",t)}catch(e){C("error","The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."),C("error",t)
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
 */}}var Nn=function(e,t){return xn(t)},Kn=function(e,t){return t.length},Un=function(e,t){return{sum:xn(t),min:Math.min.apply(null,t),max:Math.max.apply(null,t),count:t.length,sumsqr:
// no need to implement rereduce=true, because Pouch
// will never call it
function(e){for(var t=0,n=0,r=e.length;n<r;n++){var i=e[n];t+=i*i}return t}(t)}},Fn=function(e,t,n,r){function u(e,t,n){
// emit an event if there was an error thrown by a map function.
// putting try/catches in a single function also avoids deoptimizations.
try{t(n)}catch(t){Mn(e,t)}}function a(e,t,n,r,i){
// same as above, but returning the result or an error. there are two separate
// functions to avoid extra memory allocations since the tryCode() case is used
// for custom map functions (common) vs this function, which is only used for
// custom reduce functions (rare)
try{return{output:t(n,r,i)}}catch(t){return Mn(e,t),{error:t}}}function c(e,t){var n=dt(e.key,t.key);return 0!==n?n:dt(e.value,t.value)}function l(e,t,n){return n=n||0,"number"==typeof t?e.slice(n,t+n):n>0?e.slice(n):e}function d(e){var t=e.value;
// Users can explicitly specify a joined doc _id, or it
// defaults to the doc _id that emitted the key/value.
return t&&"object"==typeof t&&t._id||e.id}function h(e){return function(t){return e.include_docs&&e.attachments&&e.binary&&function(e){e.rows.forEach((function(e){var t=e.doc&&e.doc._attachments;t&&Object.keys(t).forEach((function(e){var n=t[e];t[e].data=ge(n.data,n.content_type)}))}))}(t),t}}function p(e,t,n,r){
// add an http param from opts to params, optionally json-encoded
var i=t[e];void 0!==i&&(r&&(i=encodeURIComponent(JSON.stringify(i))),n.push(e+"="+i))}function v(e){if(void 0!==e){var t=Number(e);
// prevents e.g. '1foo' or '1.1' being coerced to 1
return isNaN(t)||t!==parseInt(e,10)?e:t}}function y(e,t){var n=e.descending?"endkey":"startkey",r=e.descending?"startkey":"endkey";if(void 0!==e[n]&&void 0!==e[r]&&dt(e[n],e[r])>0)throw new bn("No rows can match your key range, reverse your start_key and end_key or set {descending : true}");if(t.reduce&&!1!==e.reduce){if(e.include_docs)throw new bn("{include_docs:true} is invalid for reduce");if(e.keys&&e.keys.length>1&&!e.group&&!e.group_level)throw new bn("Multi-key fetches for reduce views must use {group: true}")}["group_level","limit","skip"].forEach((function(t){var n=function(e){if(e){if("number"!=typeof e)return new bn('Invalid value for integer: "'+e+'"');if(e<0)return new bn('Invalid value for positive integer: "'+e+'"')}}(e[t]);if(n)throw n}))}function g(e){return function(t){
/* istanbul ignore else */
if(404===t.status)return e;throw t}}
// returns a promise for a list of docs to update, based on the input docId.
// the order doesn't matter, because post-3.2.0, bulkDocs
// is an atomic operation in all three adapters.
function _(e,t,n){var r="_local/doc_"+e,o={_id:r,keys:[]},s=n.get(e),u=s[0];return(function(e){
// only return true if the current change is 1-
// and there are no other leafs
return 1===e.length&&/^1-/.test(e[0].rev)}(s[1])?Promise.resolve(o):t.db.get(r).catch(g(o))).then((function(e){return function(e){return e.keys.length?t.db.allDocs({keys:e.keys,include_docs:!0}):Promise.resolve({rows:[]})}(e).then((function(t){return function(e,t){for(var n=[],r=new i,o=0,s=t.rows.length;o<s;o++){var a=t.rows[o].doc;if(a&&(n.push(a),r.add(a._id),a._deleted=!u.has(a._id),!a._deleted)){var c=u.get(a._id);"value"in c&&(a.value=c.value)}}var f=Pn(u);return f.forEach((function(e){if(!r.has(e)){
// new doc
var t={_id:e},i=u.get(e);"value"in i&&(t.value=i.value),n.push(t)}})),e.keys=Sn(f.concat(e.keys)),n.push(e),n}(e,t)}))}))}
// updates all emitted key/value docs and metaDocs in the mrview database
// for the given batch of documents from the source database
function m(e){var t="string"==typeof e?e:e.name,n=Ln[t];return n||(n=Ln[t]=new $n),n}function b(e){return On(m(e),(function(){return function(e){
// bind the emit function once
var t,n;var r=function(e,t){
// for temp_views one can use emit(doc, emit), see #38
if("function"==typeof e&&2===e.length){var n=e;return function(e){return n(e,t)}}return Bn(e.toString(),t)}(e.mapFun,(function(e,r){var i={id:n._id,key:ht(e)};
// Don't explicitly store the value unless it's defined and non-null.
// This saves on storage space, because often people don't use it.
null!=r&&(i.value=ht(r)),t.push(i)})),i=e.seq||0;function s(t,n){return function(){return function(e,t,n){var r="_local/lastSeq";return e.db.get(r).catch(g({_id:r,seq:0})).then((function(r){var i=Pn(t);return Promise.all(i.map((function(n){return _(n,e,t)}))).then((function(t){var i=ee(t);
// write all docs in a single operation, update the seq once
return r.seq=n,i.push(r),e.db.bulkDocs({docs:i})}))}))}(e,t,n)}}var a=new $n;function f(){return e.sourceDB.changes({return_docs:!0,conflicts:!0,include_docs:!0,style:"all_docs",since:i,limit:50}).then(l)}function l(e){var t=e.results;if(t.length){var n=d(t);if(a.add(s(n,i)),!(t.length<50))return f()}}function d(s){for(var a=new o,f=0,l=s.length;f<l;f++){var d=s[f];if("_"!==d.doc._id[0]){t=[],(n=d.doc)._deleted||u(e.sourceDB,r,n),t.sort(c);var p=h(t);a.set(d.doc._id,[p,d.changes])}i=d.seq}return a}function h(e){for(var t,n=new o,r=0,i=e.length;r<i;r++){var s=e[r],u=[s.key,s.id];r>0&&0===dt(s.key,t)&&u.push(r),n.set(pt(u),s),t=s.key}return n}return f().then((function(){return a.finish()})).then((function(){e.seq=i}))}(e)}))()}function w(e,t){return On(m(e),(function(){return function(e,t){var n,r=e.reduceFun&&!1!==t.reduce,i=t.skip||0;function s(t){return t.include_docs=!0,e.db.allDocs(t).then((function(e){return n=e.total_rows,e.rows.map((function(e){
// implicit migration - in older versions of PouchDB,
// we explicitly stored the doc as {id: ..., key: ..., value: ...}
// this is tested in a migration test
/* istanbul ignore next */
if("value"in e.doc&&"object"==typeof e.doc.value&&null!==e.doc.value){var t=Object.keys(e.doc.value).sort(),n=["id","key","value"];
// this detection method is not perfect, but it's unlikely the user
// emitted a value which was an object with these 3 exact keys
if(!(t<n||t>n))return e.doc.value}var r=function(e){
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
for(var t=[],n=[],r=0;;){var i=e[r++];if("\0"!==i)switch(i){case"1":t.push(null);break;case"2":t.push("1"===e[r]),r++;break;case"3":var o=vt(e,r);t.push(o.num),r+=o.length;break;case"4":
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
for(var s="";;){var u=e[r];if("\0"===u)break;s+=u,r++}
// perform the reverse of the order-preserving replacement
// algorithm (see above)
/* eslint-disable no-control-regex */s=s.replace(/\u0001\u0001/g,"\0").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,""),
/* eslint-enable no-control-regex */
t.push(s);break;case"5":var a={element:[],index:t.length};t.push(a.element),n.push(a);break;case"6":var c={element:{},index:t.length};t.push(c.element),n.push(c);break;
/* istanbul ignore next */default:throw new Error("bad collationIndex or unexpectedly reached end of input: "+i)}else{if(1===t.length)return t.pop();yt(t,n)}}}(e.doc._id);return{key:r[0],id:r[1],value:"value"in e.doc?e.doc.value:null}}))}))}function u(s){var u;if(u=r?function(e,t,n){0===n.group_level&&delete n.group_level;var r=n.group||n.group_level,i=function(e){var t=e.toString(),n=function(e){if(/^_sum/.test(e))return Nn;if(/^_count/.test(e))return Kn;if(/^_stats/.test(e))return Un;if(/^_/.test(e))throw new Error(e+" is not a supported reduce function.")}(t);return n||Bn(t)}(e.reduceFun),o=[],s=isNaN(n.group_level)?Number.POSITIVE_INFINITY:n.group_level;t.forEach((function(e){var t=o[o.length-1],n=r?e.key:null;if(
// only set group_level for array keys
r&&Array.isArray(n)&&(n=n.slice(0,s)),t&&0===dt(t.groupKey,n))return t.keys.push([e.key,e.id]),void t.values.push(e.value);o.push({keys:[[e.key,e.id]],values:[e.value],groupKey:n})})),t=[];for(var u=0,c=o.length;u<c;u++){var f=o[u],d=a(e.sourceDB,i,f.keys,f.values,!1);if(d.error&&d.error instanceof kn)
// CouchDB returns an error if a built-in errors out
throw d.error;t.push({
// CouchDB just sets the value to null if a non-built-in errors out
value:d.error?null:d.output,key:f.groupKey})}
// no total_rows/offset when reducing
return{rows:l(t,n.limit,n.skip)}}(e,s,t):{total_rows:n,offset:i,rows:s}
/* istanbul ignore if */,t.update_seq&&(u.update_seq=e.seq),t.include_docs){var c=Sn(s.map(d));return e.sourceDB.allDocs({keys:c,include_docs:!0,conflicts:t.conflicts,attachments:t.attachments,binary:t.binary}).then((function(e){var t=new o;return e.rows.forEach((function(e){t.set(e.id,e.doc)})),s.forEach((function(e){var n=d(e),r=t.get(n);r&&(e.doc=r)})),u}))}return u}if(void 0===t.keys||t.keys.length||(
// equivalent query
t.limit=0,delete t.keys),void 0!==t.keys){var c=t.keys.map((function(e){var n={startkey:pt([e]),endkey:pt([e,{}])};
/* istanbul ignore if */return t.update_seq&&(n.update_seq=!0),s(n)}));return Promise.all(c).then(ee).then(u)}// normal query, no 'keys'
var f,h,p={descending:t.descending};
/* istanbul ignore if */if(t.update_seq&&(p.update_seq=!0),"start_key"in t&&(f=t.start_key),"startkey"in t&&(f=t.startkey),"end_key"in t&&(h=t.end_key),"endkey"in t&&(h=t.endkey),void 0!==f&&(p.startkey=t.descending?pt([f,{}]):pt([f])),void 0!==h){var v=!1!==t.inclusive_end;t.descending&&(v=!v),p.endkey=pt(v?[h,{}]:[h])}if(void 0!==t.key){var y=pt([t.key]),g=pt([t.key,{}]);p.descending?(p.endkey=y,p.startkey=g):(p.startkey=y,p.endkey=g)}return r||("number"==typeof t.limit&&(p.limit=t.limit),p.skip=i),s(p).then(u)}(e,t)}))()}function k(t,n,r){
/* istanbul ignore next */
if("function"==typeof t._query)
// custom adapters can define their own api._query
// and override the default behavior
/* istanbul ignore next */
return function(e,t,n){return new Promise((function(r,i){e._query(t,n,(function(e,t){if(e)return i(e);r(t)}))}))}
// custom adapters can define their own api._viewCleanup
// and override the default behavior
/* istanbul ignore next */(t,n,r);if(ne(t))return function(e,t,n){
// List of parameters to add to the PUT request
var r,i,o,s=[],u="GET";
// If keys are supplied, issue a POST to circumvent GET query string limits
// see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
if(
// If opts.reduce exists and is defined, then add it to the list
// of parameters.
// If reduce=false then the results are that of only the map function
// not the final result of map and reduce.
p("reduce",n,s),p("include_docs",n,s),p("attachments",n,s),p("limit",n,s),p("descending",n,s),p("group",n,s),p("group_level",n,s),p("skip",n,s),p("stale",n,s),p("conflicts",n,s),p("startkey",n,s,!0),p("start_key",n,s,!0),p("endkey",n,s,!0),p("end_key",n,s,!0),p("inclusive_end",n,s),p("key",n,s,!0),p("update_seq",n,s),s=""===(
// Format the list of parameters into a valid URI query string
s=s.join("&"))?"":"?"+s,void 0!==n.keys){var a="keys="+encodeURIComponent(JSON.stringify(n.keys));
// according to http://stackoverflow.com/a/417184/680742,
// the de facto URL length limit is 2000 characters
a.length+s.length+1<=2e3?
// If the keys are short enough, do a GET. we do this to work around
// Safari not understanding 304s on POSTs (see pouchdb/pouchdb#1239)
s+=("?"===s[0]?"&":"?")+a:(u="POST","string"==typeof t?r={keys:n.keys}:// fun is {map : mapfun}, so append to this
t.keys=n.keys)}
// We are referencing a query defined in the design doc
if("string"==typeof t){var c=Rn(t);return e.fetch("_design/"+c[0]+"/_view/"+c[1]+s,{headers:new tt({"Content-Type":"application/json"}),method:u,body:JSON.stringify(r)}).then((function(e){return i=e.ok,o=e.status,e.json()})).then((function(e){if(!i)throw e.status=o,X(e);
// fail the entire request if the result contains an error
return e.rows.forEach((function(e){
/* istanbul ignore if */
if(e.value&&e.value.error&&"builtin_reduce_error"===e.value.error)throw new Error(e.reason)})),e})).then(h(n))}
// We are using a temporary view, terrible for performance, good for testing
return r=r||{},Object.keys(t).forEach((function(e){Array.isArray(t[e])?r[e]=t[e]:r[e]=t[e].toString()})),e.fetch("_temp_view"+s,{headers:new tt({"Content-Type":"application/json"}),method:"POST",body:JSON.stringify(r)}).then((function(e){return i=e.ok,o=e.status,e.json()})).then((function(e){if(!i)throw e.status=o,X(e);return e})).then(h(n))}(t,n,r);if("string"!=typeof n)
// temp_view
return y(r,n),In.add((function(){return Dn(
/* sourceDB */t,
/* viewName */"temp_view/temp_view",
/* mapFun */n.map,
/* reduceFun */n.reduce,
/* temporary */!0,
/* localDocName */e).then((function(e){return t=b(e).then((function(){return w(e,r)})),n=function(){return e.db.destroy()},t.then((function(e){return n().then((function(){return e}))}),(function(e){return n().then((function(){throw e}))}));
// Promise finally util similar to Q.finally
var t,n}))})),In.finish();
// persistent view
var i=n,o=Rn(i),u=o[0],a=o[1];return t.get("_design/"+u).then((function(n){var o=n.views&&n.views[a];if(!o)
// basic validator; it's assumed that every subclass would want this
throw new wn("ddoc "+n._id+" has no view named "+a);return function(e,t){var n=e.views&&e.views[t];if("string"!=typeof n.map)throw new wn("ddoc "+e._id+" has no string view named "+t+", instead found object of type: "+typeof n.map)}(n,a),y(r,o),Dn(
/* sourceDB */t,
/* viewName */i,
/* mapFun */o.map,
/* reduceFun */o.reduce,
/* temporary */!1,
/* localDocName */e).then((function(e){return"ok"===r.stale||"update_after"===r.stale?("update_after"===r.stale&&s((function(){b(e)})),w(e,r)):b(e).then((function(){return w(e,r)}))}))}))}var j;return{query:function(e,t,n){var r=this;"function"==typeof t&&(n=t,t={}),t=t?function(e){return e.group_level=v(e.group_level),e.limit=v(e.limit),e.skip=v(e.skip),e}(t):{},"function"==typeof e&&(e={map:e});var i=Promise.resolve().then((function(){return k(r,e,t)}));return jn(i,n),i},viewCleanup:(j=function(){var t=this;
/* istanbul ignore next */return"function"==typeof t._viewCleanup?function(e){return new Promise((function(t,n){e._viewCleanup((function(e,r){if(e)return n(e);t(r)}))}))}(t):ne(t)?function(e){return e.fetch("_view_cleanup",{headers:new tt({"Content-Type":"application/json"}),method:"POST"}).then((function(e){return e.json()}))}(t):function(t){return t.get("_local/"+e).then((function(e){var n=new o;Object.keys(e.views).forEach((function(e){var t=Rn(e),r="_design/"+t[0],o=t[1],s=n.get(r);s||(s=new i,n.set(r,s)),s.add(o)}));var r={keys:Pn(n),include_docs:!0};return t.allDocs(r).then((function(r){var i={};r.rows.forEach((function(t){var r=t.key.substring(8);// cuts off '_design/'
n.get(t.key).forEach((function(n){var o=r+"/"+n;
/* istanbul ignore if */e.views[o]||(
// new format, without slashes, to support PouchDB 2.2.0
// migration test in pouchdb's browser.migration.js verifies this
o=n);var s=Object.keys(e.views[o]),u=t.doc&&t.doc.views&&t.doc.views[n];
// design doc deleted, or view function nonexistent
s.forEach((function(e){i[e]=i[e]||u}))}))}));var o=Object.keys(i).filter((function(e){return!i[e]})).map((function(e){return On(m(e),(function(){return new t.constructor(e,t.__opts).destroy()}))()}));return Promise.all(o).then((function(){return{ok:!0}}))}))}),g({ok:!0}))}(t)},f((function(e){var t=e.pop(),n=j.apply(this,e);return"function"==typeof t&&jn(n,t),n})))}}("mrviews"),Jn={query:function(e,t,n){return Fn.query.call(this,e,t,n)},viewCleanup:function(e){return Fn.viewCleanup.call(this,e)}};function Vn(e){return/^1-/.test(e)}function zn(e,t){var n=Object.keys(t._attachments);return Promise.all(n.map((function(n){return e.getAttachment(t._id,n,{rev:t._rev})})))}
// Fetch all the documents from the src as described in the "diffs",
// which is a mapping of docs IDs to revisions. If the state ever
// changes to "cancelled", then the returned promise will be rejected.
// Else it will be resolved with a list of fetched documents.
var Gn="pouchdb";function Qn(e,t,n,r,i){return e.get(t).catch((function(n){if(404===n.status)return"http"!==e.adapter&&"https"!==e.adapter||$(404,"PouchDB is just checking if a remote checkpoint exists."),{session_id:r,_id:t,history:[],replicator:Gn,version:1};throw n})).then((function(o){if(!i.cancelled&&o.last_seq!==n)
// Filter out current entry for this replication
return o.history=(o.history||[]).filter((function(e){return e.session_id!==r})),
// Add the latest checkpoint to history
o.history.unshift({last_seq:n,session_id:r}),
// Just take the last pieces in history, to
// avoid really big checkpoint docs.
// see comment on history size above
o.history=o.history.slice(0,5),o.version=1,o.replicator=Gn,o.session_id=r,o.last_seq=n,e.put(o).catch((function(o){if(409===o.status)
// retry; someone is trying to write a checkpoint simultaneously
return Qn(e,t,n,r,i);throw o}));
// if the checkpoint has not changed, do not update
}))}function Wn(e,t,n,r,i){this.src=e,this.target=t,this.id=n,this.returnValue=r,this.opts=i||{}}Wn.prototype.writeCheckpoint=function(e,t){var n=this;return this.updateTarget(e,t).then((function(){return n.updateSource(e,t)}))},Wn.prototype.updateTarget=function(e,t){return this.opts.writeTargetCheckpoint?Qn(this.target,this.id,e,t,this.returnValue):Promise.resolve(!0)},Wn.prototype.updateSource=function(e,t){if(this.opts.writeSourceCheckpoint){var n=this;return Qn(this.src,this.id,e,t,this.returnValue).catch((function(e){if(Zn(e))return n.opts.writeSourceCheckpoint=!1,!0;throw e}))}return Promise.resolve(!0)};var Yn={undefined:function(e,t){
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
var n=e[0],r=e.slice(1),i=t[0],o=t.slice(1);return n&&0!==t.length?
/* istanbul ignore if */
Xn(n.session_id,t)?{last_seq:n.last_seq,history:e}:Xn(i.session_id,r)?{last_seq:i.last_seq,history:o}:Hn(r,o):{last_seq:0,history:[]}}function Xn(e,t){var n=t[0],r=t.slice(1);return!(!e||0===t.length)&&(e===n.session_id||Xn(e,r))}function Zn(e){return"number"==typeof e.status&&4===Math.floor(e.status/100)}function er(e,t,n,r,i){var o,u,a,c=[],f={seq:0,changes:[],docs:[]},l=!1,d=!1,h=!1,p=0,v=n.continuous||n.live||!1,y=n.batch_size||100,g=n.batches_limit||10,_=!1,m=n.doc_ids,b=n.selector,k=[],j=Ae();// list of batches to be processed
i=i||{ok:!0,start_time:(new Date).toISOString(),docs_read:0,docs_written:0,doc_write_failures:0,errors:[]};var O={};function S(){return a?Promise.resolve():
// Generate a unique id particular to this replication.
// Not guaranteed to align perfectly with CouchDB's rep ids.
function(e,t,n){var r=n.doc_ids?n.doc_ids.sort(dt):"",i=n.filter?n.filter.toString():"",o="",s="",u="";
// possibility for checkpoints to be lost here as behaviour of
// JSON.stringify is not stable (see #6226)
/* istanbul ignore if */return n.selector&&(u=JSON.stringify(n.selector)),n.filter&&n.query_params&&(o=JSON.stringify(function(e){return Object.keys(e).sort(dt).reduce((function(t,n){return t[n]=e[n],t}),{})}(n.query_params))),n.filter&&"_view"===n.filter&&(s=n.view.toString()),Promise.all([e.id(),t.id()]).then((function(e){var t=e[0]+e[1]+i+s+o+r+u;return new Promise((function(e){Oe(t,e)}))})).then((function(e){return"_local/"+e.replace(/\//g,".").replace(/\+/g,"_")}))}(e,t,n).then((function(i){u=i;var o;o=!1===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!1}:"source"===n.checkpoint?{writeSourceCheckpoint:!0,writeTargetCheckpoint:!1}:"target"===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!0}:{writeSourceCheckpoint:!0,writeTargetCheckpoint:!0},a=new Wn(e,t,u,r,o)}))}function P(){if(k=[],0!==o.docs.length){var e=o.docs,s={timeout:n.timeout};return t.bulkDocs({docs:e,new_edits:!1},s).then((function(t){
/* istanbul ignore if */
if(r.cancelled)throw $(),new Error("cancelled");
// `res` doesn't include full documents (which live in `docs`), so we create a map of 
// (id -> error), and check for errors while iterating over `docs`
var n=Object.create(null);t.forEach((function(e){e.error&&(n[e.id]=e)}));var o=Object.keys(n).length;i.doc_write_failures+=o,i.docs_written+=e.length-o,e.forEach((function(e){var t=n[e._id];if(t){i.errors.push(t);
// Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
var o=(t.name||"").toLowerCase();if("unauthorized"!==o&&"forbidden"!==o)throw t;r.emit("denied",w(t))}else k.push(e)}))}),(function(t){throw i.doc_write_failures+=e.length,t}))}}function A(){if(o.error)throw new Error("There was a problem getting docs.");i.last_seq=p=o.seq;var e=w(i);return k.length&&(e.docs=k,
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */
"number"==typeof o.pending&&(e.pending=o.pending,delete o.pending),r.emit("change",e)),l=!0,a.writeCheckpoint(o.seq,j).then((function(){
/* istanbul ignore if */
if(l=!1,r.cancelled)throw $(),new Error("cancelled");o=void 0,I()})).catch((function(e){throw M(e),e}))}function x(){return function(e,t,n,r){n=w(n);// we do not need to modify this
var i=[],o=!0;function s(t){
// Optimization: fetch gen-1 docs and attachments in
// a single request using _all_docs
return e.allDocs({keys:t,include_docs:!0,conflicts:!0}).then((function(e){if(r.cancelled)throw new Error("cancelled");e.rows.forEach((function(e){var t;e.deleted||!e.doc||!Vn(e.value.rev)||(t=e.doc)._attachments&&Object.keys(t._attachments).length>0||function(e){return e._conflicts&&e._conflicts.length>0}(e.doc)||(
// strip _conflicts array to appease CSG (#5793)
/* istanbul ignore if */
e.doc._conflicts&&delete e.doc._conflicts,
// the doc we got back from allDocs() is sufficient
i.push(e.doc),delete n[e.id])}))}))}return Promise.resolve().then((function(){
// filter out the generation 1 docs and get them
// leaving the non-generation one docs to be got otherwise
var e=Object.keys(n).filter((function(e){var t=n[e].missing;return 1===t.length&&Vn(t[0])}));if(e.length>0)return s(e)})).then((function(){var s=function(e){var t=[];return Object.keys(e).forEach((function(n){e[n].missing.forEach((function(e){t.push({id:n,rev:e})}))})),{docs:t,revs:!0,latest:!0}}(n);if(s.docs.length)return e.bulkGet(s).then((function(n){
/* istanbul ignore if */
if(r.cancelled)throw new Error("cancelled");return Promise.all(n.results.map((function(n){return Promise.all(n.docs.map((function(n){var r=n.ok;return n.error&&(
// when AUTO_COMPACTION is set, docs can be returned which look
// like this: {"missing":"1-7c3ac256b693c462af8442f992b83696"}
o=!1),r&&r._attachments?function(e,t,n){var r=ne(t)&&!ne(e),i=Object.keys(n._attachments);return r?e.get(n._id).then((function(r){return Promise.all(i.map((function(i){return function(e,t,n){return!e._attachments||!e._attachments[n]||e._attachments[n].digest!==t._attachments[n].digest}(r,n,i)?t.getAttachment(n._id,i):e.getAttachment(r._id,i)})))})).catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e;return zn(t,n)})):zn(t,n)}(t,e,r).then((function(e){var t=Object.keys(r._attachments);return e.forEach((function(e,n){var i=r._attachments[t[n]];delete i.stub,delete i.length,i.data=e})),r})):r})))}))).then((function(e){i=i.concat(ee(e).filter(Boolean))}))}))})).then((function(){return{ok:o,docs:i}}))}(e,t,o.diffs,r).then((function(e){o.error=!e.ok,e.docs.forEach((function(e){delete o.diffs[e._id],i.docs_read++,o.docs.push(e)}))}))}function q(){var e;r.cancelled||o||(0!==c.length?(o=c.shift(),(e={},o.changes.forEach((function(t){
// Couchbase Sync Gateway emits these, but we can ignore them
/* istanbul ignore if */
"_user/"!==t.id&&(e[t.id]=t.changes.map((function(e){return e.rev})))})),t.revsDiff(e).then((function(e){
/* istanbul ignore if */
if(r.cancelled)throw $(),new Error("cancelled");
// currentBatch.diffs elements are deleted as the documents are written
o.diffs=e}))).then(x).then(P).then(A).then(q).catch((function(e){C("batch processing terminated with error",e)}))):E(!0))}function E(e){0!==f.changes.length?(e||d||f.changes.length>=y)&&(c.push(f),f={seq:0,changes:[],docs:[]},"pending"!==r.state&&"stopped"!==r.state||(r.state="active",r.emit("active")),q()):0!==c.length||o||((v&&O.live||d)&&(r.state="pending",r.emit("paused")),d&&$())}function C(e,t){h||(t.message||(t.message=e),i.ok=!1,i.status="aborting",c=[],f={seq:0,changes:[],docs:[]},$(t))}function $(o){if(!(h||r.cancelled&&(i.status="cancelled",l)))if(i.status=i.status||"complete",i.end_time=(new Date).toISOString(),i.last_seq=p,h=!0,o){
// need to extend the error because Firefox considers ".result" read-only
(o=H(o)).result=i;
// Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
var s=(o.name||"").toLowerCase();"unauthorized"===s||"forbidden"===s?(r.emit("error",o),r.removeAllListeners()):function(e,t,n,r){if(!1===e.retry)return t.emit("error",n),void t.removeAllListeners();
/* istanbul ignore if */if("function"!=typeof e.back_off_function&&(e.back_off_function=B),t.emit("requestError",n),"active"===t.state||"pending"===t.state){t.emit("paused",n),t.state="stopped";var i=function(){e.current_back_off=0};t.once("paused",(function(){t.removeListener("active",i)})),t.once("active",i)}e.current_back_off=e.current_back_off||0,e.current_back_off=e.back_off_function(e.current_back_off),setTimeout(r,e.current_back_off)}(n,r,o,(function(){er(e,t,n,r)}))}else r.emit("complete",i),r.removeAllListeners();
/* istanbul ignore if */}function T(e,t,i){
/* istanbul ignore if */
if(r.cancelled)return $();
// Attach 'pending' property if server supports it (CouchDB 2.0+)
/* istanbul ignore if */"number"==typeof t&&(f.pending=t),Z(n)(e)&&(f.seq=e.seq||i,f.changes.push(e),s((function(){E(0===c.length&&O.live)})))}function D(e){
/* istanbul ignore if */
if(_=!1,r.cancelled)return $();
// if no results were returned then we're done,
// else fetch more
if(e.results.length>0)O.since=e.results[e.results.length-1].seq,I(),E(!0);else{var t=function(){v?(O.live=!0,I()):d=!0,E(!0)};
// update the checkpoint so we start from the right seq next time
o||0!==e.results.length?t():(l=!0,a.writeCheckpoint(e.last_seq,j).then((function(){l=!1,i.last_seq=p=e.last_seq,t()})).catch(M))}}function L(e){
/* istanbul ignore if */
if(_=!1,r.cancelled)return $();C("changes rejected",e)}function I(){if(!_&&!d&&c.length<g){_=!0,r._changes&&(// remove old changes() and listeners
r.removeListener("cancel",r._abortChanges),r._changes.cancel()),r.once("cancel",i);var t=e.changes(O).on("change",T);t.then(o,o),t.then(D).catch(L),n.retry&&(
// save for later so we can cancel if necessary
r._changes=t,r._abortChanges=i)}function i(){t.cancel()}function o(){r.removeListener("cancel",i)}}function R(){S().then((function(){
/* istanbul ignore if */
if(!r.cancelled)return a.getCheckpoint().then((function(e){O={since:p=e,limit:y,batch_size:y,style:"all_docs",doc_ids:m,selector:b,return_docs:!0},n.filter&&("string"!=typeof n.filter?
// required for the client-side filter in onChange
O.include_docs=!0:// ddoc filter
O.filter=n.filter),"heartbeat"in n&&(O.heartbeat=n.heartbeat),"timeout"in n&&(O.timeout=n.timeout),n.query_params&&(O.query_params=n.query_params),n.view&&(O.view=n.view),I()}));$()})).catch((function(e){C("getCheckpoint rejected with ",e)}))}
/* istanbul ignore next */function M(e){l=!1,C("writeCheckpoint completed with error",e)}
/* istanbul ignore if */r.ready(e,t),r.cancelled?// cancelled immediately
$():(r._addedListeners||(r.once("cancel",$),"function"==typeof n.complete&&(r.once("error",n.complete),r.once("complete",(function(e){n.complete(null,e)}))),r._addedListeners=!0),void 0===n.since?R():S().then((function(){return l=!0,a.writeCheckpoint(n.since,j)})).then((function(){l=!1,
/* istanbul ignore if */
r.cancelled?$():(p=n.since,R())})).catch(M))}
// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
function tr(){d.call(this),this.cancelled=!1,this.state="pending";var e=this,t=new Promise((function(t,n){e.once("complete",t),e.once("error",n)}));e.then=function(e,n){return t.then(e,n)},e.catch=function(e){return t.catch(e)},
// As we allow error handling via "error" event as well,
// put a stub in here so that rejecting never throws UnhandledError.
e.catch((function(){}))}function nr(e,t){var n=t.PouchConstructor;return"string"==typeof e?new n(e,t):e}function rr(e,t,n,r){if("function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),n.doc_ids&&!Array.isArray(n.doc_ids))throw H(z,"`doc_ids` filter parameter is not a list.");n.complete=r,(n=w(n)).continuous=n.continuous||n.live,n.retry="retry"in n&&n.retry,
/*jshint validthis:true */
n.PouchConstructor=n.PouchConstructor||this;var i=new tr(n);return er(nr(e,n),nr(t,n),n,i),i}function ir(e,t,n,r){return"function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),
/*jshint validthis:true */
(n=w(n)).PouchConstructor=n.PouchConstructor||this,new or(e=nr(e,n),t=nr(t,n),n,r)}function or(e,t,n,r){var i=this;this.canceled=!1;var o=n.push?T({},n,n.push):n,s=n.pull?T({},n,n.pull):n;function u(e){i.emit("change",{direction:"pull",change:e})}function a(e){i.emit("change",{direction:"push",change:e})}function c(e){i.emit("denied",{direction:"push",doc:e})}function f(e){i.emit("denied",{direction:"pull",doc:e})}function l(){i.pushPaused=!0,
/* istanbul ignore if */
i.pullPaused&&i.emit("paused")}function d(){i.pullPaused=!0,
/* istanbul ignore if */
i.pushPaused&&i.emit("paused")}function h(){i.pushPaused=!1,
/* istanbul ignore if */
i.pullPaused&&i.emit("active",{direction:"push"})}function p(){i.pullPaused=!1,
/* istanbul ignore if */
i.pushPaused&&i.emit("active",{direction:"pull"})}this.push=rr(e,t,o),this.pull=rr(t,e,s),this.pushPaused=!0,this.pullPaused=!0;var v={};function y(e){// type is 'push' or 'pull'
return function(t,n){("change"===t&&(n===u||n===a)||"denied"===t&&(n===f||n===c)||"paused"===t&&(n===d||n===l)||"active"===t&&(n===p||n===h))&&(t in v||(v[t]={}),v[t][e]=!0,2===Object.keys(v[t]).length&&
// both push and pull have asked to be removed
i.removeAllListeners(t))}}function g(e,t,n){-1==e.listeners(t).indexOf(n)&&e.on(t,n)}n.live&&(this.push.on("complete",i.pull.cancel.bind(i.pull)),this.pull.on("complete",i.push.cancel.bind(i.push))),this.on("newListener",(function(e){"change"===e?(g(i.pull,"change",u),g(i.push,"change",a)):"denied"===e?(g(i.pull,"denied",f),g(i.push,"denied",c)):"active"===e?(g(i.pull,"active",p),g(i.push,"active",h)):"paused"===e&&(g(i.pull,"paused",d),g(i.push,"paused",l))})),this.on("removeListener",(function(e){"change"===e?(i.pull.removeListener("change",u),i.push.removeListener("change",a)):"denied"===e?(i.pull.removeListener("denied",f),i.push.removeListener("denied",c)):"active"===e?(i.pull.removeListener("active",p),i.push.removeListener("active",h)):"paused"===e&&(i.pull.removeListener("paused",d),i.push.removeListener("paused",l))})),this.pull.on("removeListener",y("pull")),this.push.on("removeListener",y("push"));var _=Promise.all([this.push,this.pull]).then((function(e){var t={push:e[0],pull:e[1]};return i.emit("complete",t),r&&r(null,t),i.removeAllListeners(),t}),(function(e){if(i.cancel(),r?
// if there's a callback, then the callback can receive
// the error event
r(e):
// if there's no callback, then we're safe to emit an error
// event, which would otherwise throw an unhandled error
// due to 'error' being a special event in EventEmitters
i.emit("error",e),i.removeAllListeners(),r)
// no sense throwing if we're already emitting an 'error' event
throw e}));this.then=function(e,t){return _.then(e,t)},this.catch=function(e){return _.catch(e)}}Wn.prototype.getCheckpoint=function(){var e=this;return e.opts&&e.opts.writeSourceCheckpoint&&!e.opts.writeTargetCheckpoint?e.src.get(e.id).then((function(e){return e.last_seq||0})).catch((function(e){
/* istanbul ignore if */
if(404!==e.status)throw e;return 0})):e.target.get(e.id).then((function(t){return e.opts&&e.opts.writeTargetCheckpoint&&!e.opts.writeSourceCheckpoint?t.last_seq||0:e.src.get(e.id).then((function(e){
// Since we can't migrate an old version doc to a new one
// (no session id), we just go with the lowest seq in this case
/* istanbul ignore if */
return t.version!==e.version?0:(n=t.version?t.version.toString():"undefined")in Yn?Yn[n](t,e):0
/* istanbul ignore next */;var n}),(function(n){if(404===n.status&&t.last_seq)return e.src.put({_id:e.id,last_seq:0}).then((function(){return 0}),(function(n){return Zn(n)?(e.opts.writeSourceCheckpoint=!1,t.last_seq):0
/* istanbul ignore next */}));throw n}))})).catch((function(e){if(404!==e.status)throw e;return 0}))},l(tr,d),tr.prototype.cancel=function(){this.cancelled=!0,this.state="cancelled",this.emit("cancel")},tr.prototype.ready=function(e,t){var n=this;function r(){n.cancel()}n._readyCalled||(n._readyCalled=!0,e.once("destroyed",r),t.once("destroyed",r),n.once("complete",(function(){e.removeListener("destroyed",r),t.removeListener("destroyed",r)})))},l(or,d),or.prototype.cancel=function(){this.canceled||(this.canceled=!0,this.push.cancel(),this.pull.cancel())},Xe.plugin((function(e){e.adapter("idb",fn,!0)})).plugin((function(e){e.adapter("http",mn,!1),e.adapter("https",mn,!1)})).plugin(Jn).plugin((function(e){e.replicate=rr,e.sync=ir,Object.defineProperty(e.prototype,"replicate",{get:function(){var e=this;return void 0===this.replicateMethods&&(this.replicateMethods={from:function(t,n,r){return e.constructor.replicate(t,e,n,r)},to:function(t,n,r){return e.constructor.replicate(e,t,n,r)}}),this.replicateMethods}}),e.prototype.sync=function(e,t,n){return this.constructor.sync(this,e,t,n)}})),t.exports=Xe}).call(this)}).call(this,e("_process"))},{_process:12,argsarray:1,events:3,immediate:4,inherits:10,"spark-md5":13,uuid:15,vuvuzela:24}],12:[function(e,t,n){
// shim for using process in browser
var r,i,o=t.exports={};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
function s(){throw new Error("setTimeout has not been defined")}function u(){throw new Error("clearTimeout has not been defined")}function a(e){if(r===setTimeout)
//normal enviroments in sane situations
return setTimeout(e,0);
// if setTimeout wasn't available but was latter defined
if((r===s||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{
// when when somebody has screwed with setTimeout but no I.E. maddness
return r(e,0)}catch(t){try{
// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
return r.call(null,e,0)}catch(t){
// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:s}catch(e){r=s}try{i="function"==typeof clearTimeout?clearTimeout:u}catch(e){i=u}}();var c,f=[],l=!1,d=-1;function h(){l&&c&&(l=!1,c.length?f=c.concat(f):d=-1,f.length&&p())}function p(){if(!l){var e=a(h);l=!0;for(var t=f.length;t;){for(c=f,f=[];++d<t;)c&&c[d].run();d=-1,t=f.length}c=null,l=!1,function(e){if(i===clearTimeout)
//normal enviroments in sane situations
return clearTimeout(e);
// if clearTimeout wasn't available but was latter defined
if((i===u||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(e);try{
// when when somebody has screwed with setTimeout but no I.E. maddness
i(e)}catch(t){try{
// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
return i.call(null,e)}catch(t){
// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
// Some versions of I.E. have different rules for clearTimeout vs setTimeout
return i.call(this,e)}}}(e)}}
// v8 likes predictible objects
function v(e,t){this.fun=e,this.array=t}function y(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];f.push(new v(e,t)),1!==f.length||l||a(p)},v.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",// empty string to avoid regexp issues
o.versions={},o.on=y,o.addListener=y,o.once=y,o.off=y,o.removeListener=y,o.removeAllListeners=y,o.emit=y,o.prependListener=y,o.prependOnceListener=y,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},{}],13:[function(e,t,n){!function(e){if("object"==typeof n)
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
      generated by an if clause.  */var t=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];function n(e,t){var n=e[0],r=e[1],i=e[2],o=e[3];r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&i|~r&o)+t[0]-680876936|0)<<7|n>>>25)+r|0)&r|~n&i)+t[1]-389564586|0)<<12|o>>>20)+n|0)&n|~o&r)+t[2]+606105819|0)<<17|i>>>15)+o|0)&o|~i&n)+t[3]-1044525330|0)<<22|r>>>10)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&i|~r&o)+t[4]-176418897|0)<<7|n>>>25)+r|0)&r|~n&i)+t[5]+1200080426|0)<<12|o>>>20)+n|0)&n|~o&r)+t[6]-1473231341|0)<<17|i>>>15)+o|0)&o|~i&n)+t[7]-45705983|0)<<22|r>>>10)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&i|~r&o)+t[8]+1770035416|0)<<7|n>>>25)+r|0)&r|~n&i)+t[9]-1958414417|0)<<12|o>>>20)+n|0)&n|~o&r)+t[10]-42063|0)<<17|i>>>15)+o|0)&o|~i&n)+t[11]-1990404162|0)<<22|r>>>10)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&i|~r&o)+t[12]+1804603682|0)<<7|n>>>25)+r|0)&r|~n&i)+t[13]-40341101|0)<<12|o>>>20)+n|0)&n|~o&r)+t[14]-1502002290|0)<<17|i>>>15)+o|0)&o|~i&n)+t[15]+1236535329|0)<<22|r>>>10)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&o|i&~o)+t[1]-165796510|0)<<5|n>>>27)+r|0)&i|r&~i)+t[6]-1069501632|0)<<9|o>>>23)+n|0)&r|n&~r)+t[11]+643717713|0)<<14|i>>>18)+o|0)&n|o&~n)+t[0]-373897302|0)<<20|r>>>12)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&o|i&~o)+t[5]-701558691|0)<<5|n>>>27)+r|0)&i|r&~i)+t[10]+38016083|0)<<9|o>>>23)+n|0)&r|n&~r)+t[15]-660478335|0)<<14|i>>>18)+o|0)&n|o&~n)+t[4]-405537848|0)<<20|r>>>12)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&o|i&~o)+t[9]+568446438|0)<<5|n>>>27)+r|0)&i|r&~i)+t[14]-1019803690|0)<<9|o>>>23)+n|0)&r|n&~r)+t[3]-187363961|0)<<14|i>>>18)+o|0)&n|o&~n)+t[8]+1163531501|0)<<20|r>>>12)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r&o|i&~o)+t[13]-1444681467|0)<<5|n>>>27)+r|0)&i|r&~i)+t[2]-51403784|0)<<9|o>>>23)+n|0)&r|n&~r)+t[7]+1735328473|0)<<14|i>>>18)+o|0)&n|o&~n)+t[12]-1926607734|0)<<20|r>>>12)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r^i^o)+t[5]-378558|0)<<4|n>>>28)+r|0)^r^i)+t[8]-2022574463|0)<<11|o>>>21)+n|0)^n^r)+t[11]+1839030562|0)<<16|i>>>16)+o|0)^o^n)+t[14]-35309556|0)<<23|r>>>9)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r^i^o)+t[1]-1530992060|0)<<4|n>>>28)+r|0)^r^i)+t[4]+1272893353|0)<<11|o>>>21)+n|0)^n^r)+t[7]-155497632|0)<<16|i>>>16)+o|0)^o^n)+t[10]-1094730640|0)<<23|r>>>9)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r^i^o)+t[13]+681279174|0)<<4|n>>>28)+r|0)^r^i)+t[0]-358537222|0)<<11|o>>>21)+n|0)^n^r)+t[3]-722521979|0)<<16|i>>>16)+o|0)^o^n)+t[6]+76029189|0)<<23|r>>>9)+i|0,r=((r+=((i=((i+=((o=((o+=((n=((n+=(r^i^o)+t[9]-640364487|0)<<4|n>>>28)+r|0)^r^i)+t[12]-421815835|0)<<11|o>>>21)+n|0)^n^r)+t[15]+530742520|0)<<16|i>>>16)+o|0)^o^n)+t[2]-995338651|0)<<23|r>>>9)+i|0,r=((r+=((o=((o+=(r^((n=((n+=(i^(r|~o))+t[0]-198630844|0)<<6|n>>>26)+r|0)|~i))+t[7]+1126891415|0)<<10|o>>>22)+n|0)^((i=((i+=(n^(o|~r))+t[14]-1416354905|0)<<15|i>>>17)+o|0)|~n))+t[5]-57434055|0)<<21|r>>>11)+i|0,r=((r+=((o=((o+=(r^((n=((n+=(i^(r|~o))+t[12]+1700485571|0)<<6|n>>>26)+r|0)|~i))+t[3]-1894986606|0)<<10|o>>>22)+n|0)^((i=((i+=(n^(o|~r))+t[10]-1051523|0)<<15|i>>>17)+o|0)|~n))+t[1]-2054922799|0)<<21|r>>>11)+i|0,r=((r+=((o=((o+=(r^((n=((n+=(i^(r|~o))+t[8]+1873313359|0)<<6|n>>>26)+r|0)|~i))+t[15]-30611744|0)<<10|o>>>22)+n|0)^((i=((i+=(n^(o|~r))+t[6]-1560198380|0)<<15|i>>>17)+o|0)|~n))+t[13]+1309151649|0)<<21|r>>>11)+i|0,r=((r+=((o=((o+=(r^((n=((n+=(i^(r|~o))+t[4]-145523070|0)<<6|n>>>26)+r|0)|~i))+t[11]-1120210379|0)<<10|o>>>22)+n|0)^((i=((i+=(n^(o|~r))+t[2]+718787259|0)<<15|i>>>17)+o|0)|~n))+t[9]-343485551|0)<<21|r>>>11)+i|0,e[0]=n+e[0]|0,e[1]=r+e[1]|0,e[2]=i+e[2]|0,e[3]=o+e[3]|0}function r(e){var t,n=[];/* Andy King said do it this way. */for(t=0;t<64;t+=4)n[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return n}function i(e){var t,n=[];/* Andy King said do it this way. */for(t=0;t<64;t+=4)n[t>>2]=e[t]+(e[t+1]<<8)+(e[t+2]<<16)+(e[t+3]<<24);return n}function o(e){var t,i,o,s,u,a,c=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=c;t+=64)n(f,r(e.substring(t-64,t)));for(i=(e=e.substring(t-64)).length,o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;t<i;t+=1)o[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(o[t>>2]|=128<<(t%4<<3),t>55)for(n(f,o),t=0;t<16;t+=1)o[t]=0;
// Beware that the final length might not fit in 32 bits so we take care of that
return s=(s=8*c).toString(16).match(/(.*?)(.{0,8})$/),u=parseInt(s[2],16),a=parseInt(s[1],16)||0,o[14]=u,o[15]=a,n(f,o),f}function s(e){var n,r="";for(n=0;n<4;n+=1)r+=t[e>>8*n+4&15]+t[e>>8*n&15];return r}function u(e){var t;for(t=0;t<e.length;t+=1)e[t]=s(e[t]);return e.join("")}
// In some cases the fast add32 function cannot be used..
// ---------------------------------------------------
/**
     * Helpers.
     */function a(e){return/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e))),e}function c(e){var t,n=[],r=e.length;for(t=0;t<r-1;t+=2)n.push(parseInt(e.substr(t,2),16));return String.fromCharCode.apply(String,n)}
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
     */return u(o("hello")),
// ---------------------------------------------------
/**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */
"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||function(){function t(e,t){return(e=0|e||0)<0?Math.max(e+t,0):Math.min(e,t)}ArrayBuffer.prototype.slice=function(n,r){var i,o,s,u,a=this.byteLength,c=t(n,a),f=a;return r!==e&&(f=t(r,a)),c>f?new ArrayBuffer(0):(i=f-c,o=new ArrayBuffer(i),s=new Uint8Array(o),u=new Uint8Array(this,c,i),s.set(u),o)}}(),f.prototype.append=function(e){
// Converts the string to utf8 bytes if necessary
// Then append as binary
return this.appendBinary(a(e)),this
/**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */},f.prototype.appendBinary=function(e){this._buff+=e,this._length+=e.length;var t,i=this._buff.length;for(t=64;t<=i;t+=64)n(this._hash,r(this._buff.substring(t-64,t)));return this._buff=this._buff.substring(t-64),this
/**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */},f.prototype.end=function(e){var t,n,r=this._buff,i=r.length,o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<i;t+=1)o[t>>2]|=r.charCodeAt(t)<<(t%4<<3);return this._finish(o,i),n=u(this._hash),e&&(n=c(n)),this.reset(),n
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
     */},f.prototype._finish=function(e,t){var r,i,o,s=t;if(e[s>>2]|=128<<(s%4<<3),s>55)for(n(this._hash,e),s=0;s<16;s+=1)e[s]=0;
// Do the final computation based on the tail and length
// Beware that the final length may not fit in 32 bits so we take care of that
r=(r=8*this._length).toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(r[2],16),o=parseInt(r[1],16)||0,e[14]=i,e[15]=o,n(this._hash,e)},
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
return f.hashBinary(a(e),t)},
/**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} [raw]     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
f.hashBinary=function(e,t){var n=u(o(e));return t?c(n):n},
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
f.ArrayBuffer.prototype.append=function(e){var t,r,o,s,u=(r=this._buff.buffer,o=e,!0,(s=new Uint8Array(r.byteLength+o.byteLength)).set(new Uint8Array(r)),s.set(new Uint8Array(o),r.byteLength),s),a=u.length;for(this._length+=e.byteLength,t=64;t<=a;t+=64)n(this._hash,i(u.subarray(t-64,t)));return this._buff=t-64<a?new Uint8Array(u.buffer.slice(t-64)):new Uint8Array(0),this
/**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */},f.ArrayBuffer.prototype.end=function(e){var t,n,r=this._buff,i=r.length,o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<i;t+=1)o[t>>2]|=r[t]<<(t%4<<3);return this._finish(o,i),n=u(this._hash),e&&(n=c(n)),this.reset(),n
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
return e.buff=function(e,t){var n,r=e.length,i=new ArrayBuffer(r),o=new Uint8Array(i);for(n=0;n<r;n+=1)o[n]=e.charCodeAt(n);return o}(e.buff),f.prototype.setState.call(this,e)},f.ArrayBuffer.prototype.destroy=f.prototype.destroy,f.ArrayBuffer.prototype._finish=f.prototype._finish,
/**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     [raw] True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
f.ArrayBuffer.hash=function(e,t){var r=u(function(e){var t,r,o,s,u,a,c=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=c;t+=64)n(f,i(e.subarray(t-64,t)));
// Not sure if it is a bug, however IE10 will always produce a sub array of length 1
// containing the last element of the parent array if the sub array specified starts
// beyond the length of the parent array - weird.
// https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
for(r=(e=t-64<c?e.subarray(t-64):new Uint8Array(0)).length,o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;t<r;t+=1)o[t>>2]|=e[t]<<(t%4<<3);if(o[t>>2]|=128<<(t%4<<3),t>55)for(n(f,o),t=0;t<16;t+=1)o[t]=0;
// Beware that the final length might not fit in 32 bits so we take care of that
return s=(s=8*c).toString(16).match(/(.*?)(.{0,8})$/),u=parseInt(s[2],16),a=parseInt(s[1],16)||0,o[14]=u,o[15]=a,n(f,o),f}(new Uint8Array(e)));return t?c(r):r},f}))},{}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const r=[];for(let e=0;e<256;++e)r.push((e+256).toString(16).substr(1));n.default=function(e,t){const n=t||0,i=r;// Note: Be careful editing this code!  It's been tuned for performance
// and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
return(i[e[n+0]]+i[e[n+1]]+i[e[n+2]]+i[e[n+3]]+"-"+i[e[n+4]]+i[e[n+5]]+"-"+i[e[n+6]]+i[e[n+7]]+"-"+i[e[n+8]]+i[e[n+9]]+"-"+i[e[n+10]]+i[e[n+11]]+i[e[n+12]]+i[e[n+13]]+i[e[n+14]]+i[e[n+15]]).toLowerCase()}},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"v1",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(n,"v3",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(n,"v4",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(n,"v5",{enumerable:!0,get:function(){return s.default}});var r=u(e("./v1.js")),i=u(e("./v3.js")),o=u(e("./v4.js")),s=u(e("./v5.js"));function u(e){return e&&e.__esModule?e:{default:e}}},{"./v1.js":19,"./v3.js":20,"./v4.js":22,"./v5.js":23}],16:[function(e,t,n){"use strict";
/**
 * Calculate output length with padding and bit length
 */function r(e){return 14+(e+64>>>9<<4)+1}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */function i(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
/*
 * These functions implement the four basic operations the algorithm uses.
 */function o(e,t,n,r,o,s){return i((u=i(i(t,e),i(r,s)))<<(a=o)|u>>>32-a,n);var u,a}function s(e,t,n,r,i,s,u){return o(t&n|~t&r,e,t,i,s,u)}function u(e,t,n,r,i,s,u){return o(t&r|n&~r,e,t,i,s,u)}function a(e,t,n,r,i,s,u){return o(t^n^r,e,t,i,s,u)}function c(e,t,n,r,i,s,u){return o(n^(t|~r),e,t,i,s,u)}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=
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
 */return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let i=0;i<n;i+=8){const n=e[i>>5]>>>i%32&255,o=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(o)}return t}(function(e,t){
/* append padding */
e[t>>5]|=128<<t%32,e[r(t)-1]=t;let n=1732584193,o=-271733879,f=-1732584194,l=271733878;for(let t=0;t<e.length;t+=16){const r=n,d=o,h=f,p=l;n=s(n,o,f,l,e[t],7,-680876936),l=s(l,n,o,f,e[t+1],12,-389564586),f=s(f,l,n,o,e[t+2],17,606105819),o=s(o,f,l,n,e[t+3],22,-1044525330),n=s(n,o,f,l,e[t+4],7,-176418897),l=s(l,n,o,f,e[t+5],12,1200080426),f=s(f,l,n,o,e[t+6],17,-1473231341),o=s(o,f,l,n,e[t+7],22,-45705983),n=s(n,o,f,l,e[t+8],7,1770035416),l=s(l,n,o,f,e[t+9],12,-1958414417),f=s(f,l,n,o,e[t+10],17,-42063),o=s(o,f,l,n,e[t+11],22,-1990404162),n=s(n,o,f,l,e[t+12],7,1804603682),l=s(l,n,o,f,e[t+13],12,-40341101),f=s(f,l,n,o,e[t+14],17,-1502002290),o=s(o,f,l,n,e[t+15],22,1236535329),n=u(n,o,f,l,e[t+1],5,-165796510),l=u(l,n,o,f,e[t+6],9,-1069501632),f=u(f,l,n,o,e[t+11],14,643717713),o=u(o,f,l,n,e[t],20,-373897302),n=u(n,o,f,l,e[t+5],5,-701558691),l=u(l,n,o,f,e[t+10],9,38016083),f=u(f,l,n,o,e[t+15],14,-660478335),o=u(o,f,l,n,e[t+4],20,-405537848),n=u(n,o,f,l,e[t+9],5,568446438),l=u(l,n,o,f,e[t+14],9,-1019803690),f=u(f,l,n,o,e[t+3],14,-187363961),o=u(o,f,l,n,e[t+8],20,1163531501),n=u(n,o,f,l,e[t+13],5,-1444681467),l=u(l,n,o,f,e[t+2],9,-51403784),f=u(f,l,n,o,e[t+7],14,1735328473),o=u(o,f,l,n,e[t+12],20,-1926607734),n=a(n,o,f,l,e[t+5],4,-378558),l=a(l,n,o,f,e[t+8],11,-2022574463),f=a(f,l,n,o,e[t+11],16,1839030562),o=a(o,f,l,n,e[t+14],23,-35309556),n=a(n,o,f,l,e[t+1],4,-1530992060),l=a(l,n,o,f,e[t+4],11,1272893353),f=a(f,l,n,o,e[t+7],16,-155497632),o=a(o,f,l,n,e[t+10],23,-1094730640),n=a(n,o,f,l,e[t+13],4,681279174),l=a(l,n,o,f,e[t],11,-358537222),f=a(f,l,n,o,e[t+3],16,-722521979),o=a(o,f,l,n,e[t+6],23,76029189),n=a(n,o,f,l,e[t+9],4,-640364487),l=a(l,n,o,f,e[t+12],11,-421815835),f=a(f,l,n,o,e[t+15],16,530742520),o=a(o,f,l,n,e[t+2],23,-995338651),n=c(n,o,f,l,e[t],6,-198630844),l=c(l,n,o,f,e[t+7],10,1126891415),f=c(f,l,n,o,e[t+14],15,-1416354905),o=c(o,f,l,n,e[t+5],21,-57434055),n=c(n,o,f,l,e[t+12],6,1700485571),l=c(l,n,o,f,e[t+3],10,-1894986606),f=c(f,l,n,o,e[t+10],15,-1051523),o=c(o,f,l,n,e[t+1],21,-2054922799),n=c(n,o,f,l,e[t+8],6,1873313359),l=c(l,n,o,f,e[t+15],10,-30611744),f=c(f,l,n,o,e[t+6],15,-1560198380),o=c(o,f,l,n,e[t+13],21,1309151649),n=c(n,o,f,l,e[t+4],6,-145523070),l=c(l,n,o,f,e[t+11],10,-1120210379),f=c(f,l,n,o,e[t+2],15,718787259),o=c(o,f,l,n,e[t+9],21,-343485551),n=i(n,r),o=i(o,d),f=i(f,h),l=i(l,p)}return[n,o,f,l]}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */(function(e){if(0===e.length)return[];const t=8*e.length,n=new Uint32Array(r(t));for(let r=0;r<t;r+=8)n[r>>5]|=(255&e[r/8])<<r%32;return n}(e),8*e.length))}},{}],17:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){if(!r)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(i)};
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
const r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),i=new Uint8Array(16)},{}],18:[function(e,t,n){"use strict";
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function r(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function i(e,t){return e<<t|e>>>32-t}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=function(e){const t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));// UTF8 escape
e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}e.push(128);const o=e.length/4+2,s=Math.ceil(o/16),u=new Array(s);for(let t=0;t<s;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];u[t]=n}u[s-1][14]=8*(e.length-1)/Math.pow(2,32),u[s-1][14]=Math.floor(u[s-1][14]),u[s-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<s;++e){const o=new Uint32Array(80);for(let t=0;t<16;++t)o[t]=u[e][t];for(let e=16;e<80;++e)o[e]=i(o[e-3]^o[e-8]^o[e-14]^o[e-16],1);let s=n[0],a=n[1],c=n[2],f=n[3],l=n[4];for(let e=0;e<80;++e){const n=Math.floor(e/20),u=i(s,5)+r(n,a,c,f)+l+t[n]+o[e]>>>0;l=f,f=c,c=i(a,30)>>>0,a=s,s=u}n[0]=n[0]+s>>>0,n[1]=n[1]+a>>>0,n[2]=n[2]+c>>>0,n[3]=n[3]+f>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}},{}],19:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=o(e("./rng.js")),i=o(e("./bytesToUuid.js"));function o(e){return e&&e.__esModule?e:{default:e}}
// **`v1()` - Generate time-based UUID**
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let s,u,a=0,c=0;n.default=// See https://github.com/uuidjs/uuid for API details
function(e,t,n){let o=t&&n||0;const f=t||[];let l=(e=e||{}).node||s,d=void 0!==e.clockseq?e.clockseq:u;// node and clockseq need to be initialized to random values if they're not
// specified.  We do this lazily to minimize issues related to insufficient
// system entropy.  See #189
if(null==l||null==d){const t=e.random||(e.rng||r.default)();null==l&&(
// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
l=s=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==d&&(
// Per 4.2.2, randomize (14 bit) clockseq
d=u=16383&(t[6]<<8|t[7]))}// UUID timestamps are 100 nano-second units since the Gregorian epoch,
// (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
// time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
// (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
let h=void 0!==e.msecs?e.msecs:Date.now(),p=void 0!==e.nsecs?e.nsecs:c+1;// Per 4.2.1.2, use count of uuid's generated during the current clock
// cycle to simulate higher resolution clock
// Time since last uuid creation (in msecs)
const v=h-a+(p-c)/1e4;// Per 4.2.1.2, Bump clockseq on clock regression
// Per 4.2.1.2 Throw error if too many uuids are requested
if(v<0&&void 0===e.clockseq&&(d=d+1&16383),// Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
// time interval
(v<0||h>a)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");a=h,c=p,u=d,// Per 4.1.4 - Convert from unix epoch to Gregorian epoch
h+=122192928e5;// `time_low`
const y=(1e4*(268435455&h)+p)%4294967296;f[o++]=y>>>24&255,f[o++]=y>>>16&255,f[o++]=y>>>8&255,f[o++]=255&y;// `time_mid`
const g=h/4294967296*1e4&268435455;f[o++]=g>>>8&255,f[o++]=255&g,// `time_high_and_version`
f[o++]=g>>>24&15|16,// include version
f[o++]=g>>>16&255,// `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
f[o++]=d>>>8|128,// `clock_seq_low`
f[o++]=255&d;// `node`
for(let e=0;e<6;++e)f[o+e]=l[e];return t||(0,i.default)(f)}},{"./bytesToUuid.js":14,"./rng.js":17}],20:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=o(e("./v35.js")),i=o(e("./md5.js"));function o(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.default)("v3",48,i.default);n.default=s},{"./md5.js":16,"./v35.js":21}],21:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,t,n){function r(e,r,o,s){const u=o&&s||0;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));// UTF8 escape
const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=function(e){
// Note: We assume we're being passed a valid uuid string
const t=[];return e.replace(/[a-fA-F0-9]{2}/g,(function(e){t.push(parseInt(e,16))})),t}(r)),!Array.isArray(e))throw TypeError("value must be an array of bytes");if(!Array.isArray(r)||16!==r.length)throw TypeError("namespace must be uuid string or an Array of 16 byte values");// Per 4.3
const a=n(r.concat(e));if(a[6]=15&a[6]|t,a[8]=63&a[8]|128,o)for(let e=0;e<16;++e)o[u+e]=a[e];return o||(0,i.default)(a)}// Function#name is not settable on some platforms (#270)
try{r.name=e;// eslint-disable-next-line no-empty
}catch(e){}// For CommonJS default export support
return r.DNS=o,r.URL=s,r},n.URL=n.DNS=void 0;var r,i=(r=e("./bytesToUuid.js"))&&r.__esModule?r:{default:r};const o="6ba7b810-9dad-11d1-80b4-00c04fd430c8";n.DNS=o;const s="6ba7b811-9dad-11d1-80b4-00c04fd430c8";n.URL=s},{"./bytesToUuid.js":14}],22:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=o(e("./rng.js")),i=o(e("./bytesToUuid.js"));function o(e){return e&&e.__esModule?e:{default:e}}n.default=function(e,t,n){"string"==typeof e&&(t="binary"===e?new Uint8Array(16):null,e=null);const o=(e=e||{}).random||(e.rng||r.default)();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
// Copy bytes to buffer, if provided
if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,t){const e=n||0;for(let n=0;n<16;++n)t[e+n]=o[n];return t}return(0,i.default)(o)}},{"./bytesToUuid.js":14,"./rng.js":17}],23:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=o(e("./v35.js")),i=o(e("./sha1.js"));function o(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.default)("v5",80,i.default);n.default=s},{"./sha1.js":18,"./v35.js":21}],24:[function(e,t,n){"use strict";
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
n.pop(),r=n[n.length-1]);var i=r.element,o=r.index;Array.isArray(i)?i.push(e):o===t.length-2?i[t.pop()]=e:t.push(e);// obj with key only
}n.stringify=function(e){var t=[];t.push({obj:e});for(var n,r,i,o,s,u,a,c,f,l,d="";n=t.pop();)if(r=n.obj,d+=n.prefix||"",i=n.val||"")d+=i;else if("object"!=typeof r)d+=void 0===r?null:JSON.stringify(r);else if(null===r)d+="null";else if(Array.isArray(r)){for(t.push({val:"]"}),o=r.length-1;o>=0;o--)s=0===o?"":",",t.push({obj:r[o],prefix:s});t.push({val:"["})}else{for(a in// object
u=[],r)r.hasOwnProperty(a)&&u.push(a);for(t.push({val:"}"}),o=u.length-1;o>=0;o--)f=r[c=u[o]],l=o>0?",":"",l+=JSON.stringify(c)+":",t.push({obj:f,prefix:l});t.push({val:"{"})}return d},n.parse=function(e){for(var t,n,i,o,s,u,a,c,f,l=[],d=[],h=0;;)if("}"!==(t=e[h++])&&"]"!==t&&void 0!==t)switch(t){case" ":case"\t":case"\n":case":":case",":break;case"n":h+=3,// 'ull'
r(null,l,d);break;case"t":h+=3,// 'rue'
r(!0,l,d);break;case"f":h+=4,// 'alse'
r(!1,l,d);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"-":for(n="",h--;;){if(i=e[h++],!/[\d\.\-e\+]/.test(i)){h--;break}n+=i}r(parseFloat(n),l,d);break;case'"':for(o="",s=void 0,u=0;'"'!==(a=e[h++])||"\\"===s&&u%2==1;)o+=a,"\\"===(s=a)?u++:u=0;r(JSON.parse('"'+o+'"'),l,d);break;case"[":c={element:[],index:l.length},l.push(c.element),d.push(c);break;case"{":f={element:{},index:l.length},l.push(f.element),d.push(f);break;default:throw new Error("unexpectedly reached end of input: "+t)}else{if(1===l.length)return l.pop();r(l.pop(),l,d)}}},{}]},{},[11])(11)})),define("persist/impl/pouchDBPersistenceStore",["../PersistenceStore","../impl/storageUtils","pouchdb","./logger"],(function(e,t,n,r){"use strict";var i=function(t){e.call(this,t)};(i.prototype=new e).Init=function(e){this._version=e&&e.version||"0";var t=this._name+this._version,i=e?e.adapter:null,o=this._extractDBOptions(e);if(i)try{i.plugin&&n.plugin(i.plugin),(o=o||{}).adapter=i.name,this._dbOptions=o,this._db=new n(t,o)}catch(e){return r.log("Error creating PouchDB instance with adapter "+i+": ",e.message),r.log("Please make sure the needed plugin and adapter are installed."),Promise.reject(e)}else o?(this._dbOptions=o,this._db=new n(t,o)):(this._dbOptions=null,this._db=new n(t));return e&&e.index&&(Array.isArray(e.index)?(this._index=e.index.filter((function(e){return"key"!==e})),0===this._index.length&&(this._index=null)):r.log("index must be an array")),this._createIndex()},i.prototype._extractDBOptions=function(e){var t=null;if(e){var n=this;Object.keys(e).forEach((function(r){n._isPersistenceStoreKey(r)||(t||(t={}),t[r]=e[r])}))}return t},i.prototype._isPersistenceStoreKey=function(e){return"version"===e||"adapter"===e||"index"===e||"skipMetadata"===e},i.prototype._createIndex=function(){if(this._index&&this._db.createIndex){var e=this,t=e._name+e._index.toString().replace(",","").replace(".",""),n={index:{fields:e._index,name:t}};return e._db.createIndex(n).catch((function(t){r.error("creating index on "+e._index.toString()+" failed with error "+t)}))}return Promise.resolve()},i.prototype.upsert=function(e,t,n,i){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsert() for key: "+e);var s=this,u=e.toString();return s._db.get(u).then((function(e){return o(i,e)?e:Promise.reject({status:409})})).catch((function(e){return 404===e.status&&"missing"===e.message?void 0:Promise.reject(e)})).then((function(e){return s._put(u,t,n,i,e)}))},i.prototype._put=function(e,t,n,r,i){var o=[],s=this._prepareUpsert(n,o),u={_id:e,key:e,metadata:t,value:s?null:n};i&&(u._rev=i._rev);var a=this;return a._db.put(u).then((function(t){return a._addAttachments(e,t.rev,o)})).catch((function(e){if(409!==e.status)throw e}))};var o=function(e,t){return!e||t.metadata.versionIdentifier===e};i.prototype._addAttachments=function(e,t,n){if(n&&n.length){var i=this,o=n.map((function(n){var r;return r=n.value instanceof Blob?n.value:new Blob([n.value]),i._db.putAttachment(e,n.path,t,r,"binary")}),this);return Promise.all(o).catch((function(t){r.error("store: "+i._name+" failed add attachment for doc "+e)}))}return Promise.resolve()},i.prototype.upsertAll=function(e){if(r.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsertAll()"),e&&e.length){var t=this,n={},i=e.map((function(e){var r=e.key.toString(),i=e.value,o=[],s=t._prepareUpsert(i,o);o.length>0&&(n[r]=o);var u={_id:r,key:e.key,metadata:e.metadata,value:s?null:i};return t._db.get(r).then((function(e){return u._rev=e._rev,u})).catch((function(e){if(404===e.status&&"missing"===e.message)return u;throw e}))}));return Promise.all(i).then((function(e){return t._db.bulkDocs(e)})).then((function(e){var i=[];if(e.forEach((function(e,o){if(e.ok){var s=n[e.id];s&&i.push(t._addAttachments(e.id,e.rev,s))}else 409===e.status&&r.log("conflict error")})),i.length>0)return Promise.all(i)})).catch((function(e){r.log("error in upsertAll")}))}return Promise.resolve()},i.prototype.find=function(e){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: find() for expression: "+JSON.stringify(e));var n=this;if(e=e||{},n._db.find){var i=n._prepareFind(e);return n._db.find(i).then((function(e){if(e&&e.docs&&e.docs.length){var t=e.docs.map(n._findResultCallback(i.fields),n);return Promise.all(t)}return[]})).catch((function(e){if(404===e.status&&"missing"===e.message)return[];throw e}))}return n._db.allDocs({include_docs:!0}).then((function(r){if(r&&r.rows&&r.rows.length){var i=r.rows.filter((function(n){var r=n.doc;return!(s(n)||!t.satisfy(e.selector,r))}));if(i.length){var o=i.map((function(e){return n._fixKey(e.doc),e.doc})),u=t.sortRows(o,e.sort).map((function(r){return n._fixBinaryValue(r).then((function(n){return e.fields?t.assembleObject(n,e.fields):n.value}))}));return Promise.all(u)}return[]}return[]})).catch((function(e){return r.log("error retrieving all documents from pouch db, returns empty list as find operation.",e),[]}))},i.prototype._findResultCallback=function(e){return function(t){return this._fixValue(t).then((function(t){return e?t:t.value}))}},i.prototype._fixValue=function(e){return this._fixKey(e),this._fixBinaryValue(e)},i.prototype._fixBinaryValue=function(e){var t=e._id||e.id||e.key,n=e._attachments;if(n){var i=this,o=Object.keys(n)[0];return i._db.getAttachment(t,o).then((function(t){if("rootpath"===o)e.value=t;else{for(var n=o.split("."),r=e.value,i=0;i<n.length-1;i++)r=r[n[i]];r[n[n.length-1]]=t}return e})).catch((function(e){r.error("store: "+i._name+" error getting attachment. ")}))}return Promise.resolve(e)},i.prototype.findByKey=function(e){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: findByKey() for key: "+e);var t=this,n=e.toString();return t._db.get(n,{attachments:!0}).then((function(e){return t._fixBinaryValue(e)})).then((function(e){return e.value})).catch((function(e){return 404===e.status&&"missing"===e.message?void 0:Promise.reject(e)}))},i.prototype.removeByKey=function(e){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: removeByKey() for key: "+e);var t=this;if(!e)return Promise.resolve(!1);var n=e.toString();return t._db.get(n).then((function(e){return t._db.remove(e)})).then((function(){return!0})).catch((function(e){return(404!==e.status||"missing"!==e.message)&&Promise.reject(e)}))},i.prototype.delete=function(e){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: delete() for expression: "+JSON.stringify(e));var t=this;if(e){var i=e;return i.fields=["_id","_rev"],t.find(i).then((function(e){if(e&&e.length){var n=e.map((function(e){return{_id:e._id,_rev:e._rev,_deleted:!0}}));return t._db.bulkDocs(n)}})).catch((function(e){r.error("store: "+t._name+" error deleting....")}))}return t._db.destroy().then((function(){var e=t._name+t._version;return t._dbOptions?t._db=new n(e,t._dbOptions):t._db=new n(e),t._createIndex()})).catch((function(e){r.error("store: "+t._name+" error deleting....")}))},i.prototype.keys=function(){r.log("Offline Persistence Toolkit pouchDBPersistenceStore: keys()");var e=this;return e._db.allDocs().then((function(e){var t=e.rows,n=[];if(t&&t.length)for(var r=0;r<t.length;r++)s(t[r])||n.push(t[r].id);return n})).catch((function(t){r.error("store: "+e._name+" error getting all the docs for keys ")}))},i.prototype._prepareFind=function(e){var t={},n=e.selector;n?n&&(t.selector=n):t.selector={_id:{$gt:null}};var r=e.fields;return r&&r.length&&(t.fields=r,-1!==r.indexOf("key")&&-1===r.indexOf("_id")&&t.fields.push("_id")),t},i.prototype._prepareUpsert=function(e,t){return!!e&&(e instanceof Blob||e instanceof ArrayBuffer?(t.push({path:"rootpath",value:e}),!0):(this._inspectValue("",e,t),!1))},i.prototype._inspectValue=function(e,t,n){for(var r in t)if(t.hasOwnProperty(r)){var i=t[r];if(i&&"object"==typeof i)if(i instanceof Blob||i instanceof ArrayBuffer){var o=e;o.length>0&&(o+=".");var s={path:o+r,value:i};n.push(s),t.key=null}else if(void 0===i.length){var u=e;e.length>0&&(e+="."),e+=r,this._inspectValue(e,i,n),e=u}}},i.prototype.updateKey=function(e,t){r.log("Offline Persistence Toolkit PouchDBPersistenceStore: updateKey() with currentKey: "+e+" and new key: "+t);var n=this;return n._db.get(e).then((function(e){return e?n.upsert(t,e.metadata,e.value):Promise.reject("No existing key found to update")})).then((function(){return n.removeByKey(e)})).catch((function(){r.error("store: "+n._name+" error updating key")}))};var s=function(e){return e.id.startsWith("_design/")};return i.prototype._fixKey=function(e){var t=e._id||e.id||e.key;t&&(e.key=t)},i})),define("persist/pouchDBPersistenceStoreFactory",["./impl/pouchDBPersistenceStore"],(function(e){"use strict";return{createPersistenceStore:function(t,n){return function(t,n){var r=new e(t);return r.Init(n).then((function(){return r}))}(t,n)}}})),define("persist/impl/fileSystemPersistenceStore",["./keyValuePersistenceStore","../persistenceStoreManager","./logger"],(function(e,t,n){"use strict";var r=function(t){e.call(this,t),this._directoryName=f(t),this._directory=null};function i(e,t,n){return o().then((function(r){return r.upsert(e,n,{filename:t,metadata:n})}))}function o(){return t.openStore("fileIndex",{index:["key"],skipMetadata:!0})}function s(e,t){return new Promise((function(n,r){e._directory.getFile(t,{create:!1,exclusive:!1},(function(e){n(e)}),(function(e){e.code===FileError.NOT_FOUND_ERR||e.code===FileError.SYNTAX_ERR?n(null):r(e)}))}))}function u(e){return o().then((function(t){return t.findByKey(e)}))}function a(e){return o().then((function(t){return t.removeByKey(e)}))}function c(e,t){return s(e,t).then((function(e){return!!e&&new Promise((function(t,n){e.remove((function(){t(!0)}),(function(e){t(!1)}))}))}))}function f(e){var t=e.replace(/[<>\:"\/\\\|\?\*\~]/g,"").replace(/^\.+$/,"").replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i,"").replace(/[\x00-\x1f\x80-\x9f]/g,"");return t.length>255?t.slice(0,255):t}return(r.prototype=new e).Init=function(t){var n=this;return e.prototype.Init.call(n,t).then((function(){return n._directoryName=f(n._name+n._version),new Promise((function(e,t){window.requestFileSystem(LocalFileSystem.PERSISTENT,0,(function(t){t.root.getDirectory(n._directoryName,{create:!0},(function(t){n._directory=t,e()}))}),(function(e){t(e)}))}))}))},r.prototype._insert=function(e,t,n){var r=this;return this.removeByKey(e).then((function(){n instanceof Blob?t.data_type="Blob":t.data_type="JSON";var o=r._directory.createReader();return new Promise((function(s,u){o.readEntries((function(o){for(var u=function(e){return o.filter((function(t){return t.name==e})).length>0},a=Math.floor(1e8*Math.random())+".pds";u(a);)a=Math.floor(1e8*Math.random())+".pds";(function(e,t,n,r,o){return new Promise((function(s,u){e._directory.getFile(t,{create:!0,exclusive:!1},(function(e){e.createWriter((function(e){e.onwriteend=function(){i(n,t,r).then((function(){s()}))},e.onerror=function(e){u(e)},"JSON"==r.data_type&&(o=JSON.stringify(o)),e.write(o)}))}))}))})(r,a,e,t,n).then((function(){s()}))}))}))}))},r.prototype.getItem=function(e){n.log("Offline Persistence Toolkit fileSystemPersistenceStore: getItem() with key: "+e);var t=this;return u(e).then((function(e){if(e){var n=e.filename,r=e.metadata;return s(t,n).then((function(e){if(e)return new Promise((function(t,n){e.file((function(e){var n=new FileReader;n.onloadend=function(e){var n,i,o=(n=this.result,0,i=new DataView(n.slice(0)),new Blob([i]));if("JSON"==r.data_type){var s=new FileReader;s.onloadend=function(){t({metadata:r,value:JSON.parse(this.result)})},s.readAsText(o)}else t({metadata:r,value:o})},n.readAsArrayBuffer(e)}),(function(e){n(e)}))}))}))}}))},r.prototype.removeByKey=function(e){n.log("Offline Persistence Toolkit fileSystemPersistenceStore: removeByKey() with key: "+e);var t=this;return u(e).then((function(n){return n?a(e).then((function(){return c(t,n.filename)})):Promise.resolve(!1)}))},r.prototype.keys=function(){return n.log("Offline Persistence Toolkit fileSystemPersistenceStore: keys()"),o().then((function(e){return e.keys()}))},r.prototype.deleteAll=function(){n.log("Offline Persistence Toolkit fileSystemPersistenceStore: deleteAll()");var e=this;return o().then((function(e){return e.delete()})).then((function(){var t=[],n=e._directory.createReader();return t.push(new Promise((function(r,i){n.readEntries((function(n){n.map((function(n){t.push(c(e,n.name))})),r()}))}))),Promise.all(t)}))},r.prototype.updateKey=function(e,t){return n.log("Offline Persistence Toolkit FileSystemPersistenceStore: updateKey() with currentKey: "+e+" and new key: "+t),u(e).then((function(e){if(e){var n=e.filename,r=e.metadata;return i(t,n,r)}return Promise.reject("No existing key found to update")})).then((function(){return a(e)}))},r})),define("persist/fileSystemPersistenceStoreFactory",["./impl/fileSystemPersistenceStore"],(function(e){"use strict";return{createPersistenceStore:function(t,n){return function(t,n){var r=new e(t);return r.Init(n).then((function(){return r}))}(t,n)}}})),define("persist/persistenceStoreFactory",[],(function(){"use strict";return{createPersistenceStore:function(e,t){}}}));