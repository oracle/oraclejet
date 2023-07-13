/*!
 * jQuery UI Effects Highlight 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("highlight","show",(function(o,r){var n=e(this),t={backgroundColor:n.css("backgroundColor")};"hide"===o.mode&&(t.opacity=0),e.effects.saveStyle(n),n.css({backgroundImage:"none",backgroundColor:o.color||"#ffff99"}).animate(t,{queue:!1,duration:o.duration,easing:o.easing,complete:r})}))}));