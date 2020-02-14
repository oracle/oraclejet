/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","require","ojs/ojasyncvalidator-adapter"],function(t,e,o){"use strict";function n(t){"@babel/helpers - typeof";return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t,e,o){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,o){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=c(t)););return t}(t,e);if(n){var r=Object.getOwnPropertyDescriptor(n,e);return r.get?r.get.call(o):r.value}})(t,e,o||t)}function c(t){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
return function(n){function a(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),(e=i(this,c(a).call(this,t))).options=t,e}var l,p,s;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(a,o),l=a,(p=[{key:"_InitLoadingPromise",value:function(){this._loadingPromise||(this._loadingPromise=t.__getRequirePromise("./ojvalidator-daterestriction",e))}},{key:"hint",get:function(){return u(c(a.prototype),"_GetHint",this).call(this)}}])&&r(l.prototype,p),s&&r(l,s),a}()});