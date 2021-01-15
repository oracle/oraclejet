!function(){function n(n,t){for(var o=0;o<t.length;o++){var e=t[o];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,e.key,e)}}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";return function(){function t(n){if(function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=n,!n.max)throw new Error("length filter's max option cannot be less than 1. max option is "+n.max);if(isNaN(n.max))throw new Error("length filter's max option is not a number. max option is "+n.max);if(null!==n.max&&n.max<1)throw new Error("length filter's max option cannot be less than 1. max option is "+n.max);n.countBy=void 0===n.countBy?"codePoint":n.countBy}var o,e,i;return o=t,(e=[{key:"filter",value:function(n,t){return this.calcLength(t)<=this.options.max?t:n.slice(0,this.options.max)}},{key:"calcLength",value:function(n){var t=this.options.countBy;if(""==n||null==n||null==n)return 0;var o,e=n.length,i=0;switch(t){case"codePoint":for(var r=0;r<e;r++)55296==(63488&n.charCodeAt(r))&&(i+=1);o=e-i/2;break;case"codeUnit":default:o=e}return o}}])&&n(o.prototype,e),i&&n(o,i),t}()})}();
//# sourceMappingURL=ojfilter-length.js.map