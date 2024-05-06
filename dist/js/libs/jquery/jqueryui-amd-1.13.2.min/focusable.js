/*!
 * jQuery UI Focusable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):"object"==typeof module&&module.exports?(require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.ui.focusable=function(i,t){var r,s,n,o,u,a=i.nodeName.toLowerCase();return"area"===a?(s=(r=i.parentNode).name,!(!i.href||!s||"map"!==r.nodeName.toLowerCase())&&((n=e("img[usemap='#"+s+"']")).length>0&&n.is(":visible"))):(/^(input|select|textarea|button|object)$/.test(a)?(o=!i.disabled)&&(u=e(i).closest("fieldset")[0])&&(o=!u.disabled):o="a"===a&&i.href||t,o&&e(i).is(":visible")&&function(e){var i=e.css("visibility");for(;"inherit"===i;)e=e.parent(),i=e.css("visibility");return"visible"===i}(e(i)))},e.extend(e.expr.pseudos,{focusable:function(i){return e.ui.focusable(i,null!=e.attr(i,"tabindex"))}}),e.ui.focusable}));