/*!
 * jQuery UI Tabbable 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version","./focusable"],e):"object"==typeof module&&module.exports?(require("./version"),require("./focusable"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.extend(e.expr.pseudos,{tabbable:function(u){var r=e.attr(u,"tabindex"),t=null!=r;return(!t||r>=0)&&e.ui.focusable(u,t)}})}));