/*!
 * jQuery UI Effects Drop 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("drop","hide",(function(t,i){var o,r=e(this),u="show"===t.mode,n=t.direction||"left",f="up"===n||"down"===n?"top":"left",c="up"===n||"left"===n?"-=":"+=",d="+="===c?"-=":"+=",s={opacity:0};e.effects.createPlaceholder(r),o=t.distance||r["top"===f?"outerHeight":"outerWidth"](!0)/2,s[f]=c+o,u&&(r.css(s),s[f]=d+o,s.opacity=1),r.animate(s,{queue:!1,duration:t.duration,easing:t.easing,complete:i})}))}));