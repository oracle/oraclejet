/*!
 * jQuery UI Scroll Parent 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):"object"==typeof module&&module.exports?(require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.fn.scrollParent=function(t){var o=this.css("position"),r="absolute"===o,s=t?/(auto|scroll|hidden)/:/(auto|scroll)/,n=this.parents().filter((function(){var t=e(this);return(!r||"static"!==t.css("position"))&&s.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))})).eq(0);return"fixed"!==o&&n.length?n:e(this[0].ownerDocument||document)}}));