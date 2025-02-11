/*!
 * jQuery UI Focusable 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):"object"==typeof module&&module.exports?(require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.ui.focusable=function(t,i){var s,o,u,r,n,a=t.nodeName.toLowerCase();return"area"===a?(o=(s=t.parentNode).name,!(!t.href||!o||"map"!==s.nodeName.toLowerCase())&&((u=e("img[usemap='#"+o+"']")).length>0&&u.is(":visible"))):(/^(input|select|textarea|button|object)$/.test(a)?(r=!t.disabled)&&(n=e(t).closest("fieldset")[0])&&(r=!n.disabled):r="a"===a&&t.href||i,r&&e(t).is(":visible")&&"visible"===e(t).css("visibility"))},e.extend(e.expr.pseudos,{focusable:function(t){return e.ui.focusable(t,null!=e.attr(t,"tabindex"))}}),e.ui.focusable}));