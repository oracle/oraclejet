/*!
 * jQuery UI Effects Fade 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("fade","toggle",(function(t,i){var o="show"===t.mode;e(this).css("opacity",o?0:1).animate({opacity:o?1:0},{queue:!1,duration:t.duration,easing:t.easing,complete:i})}))}));