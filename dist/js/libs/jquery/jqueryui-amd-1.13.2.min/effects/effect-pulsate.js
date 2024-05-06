/*!
 * jQuery UI Effects Pulsate 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("pulsate","show",(function(i,t){var o=e(this),s=i.mode,u="show"===s,n=u||"hide"===s,f=2*(i.times||5)+(n?1:0),r=i.duration/f,c=0,a=1,d=o.queue().length;for(!u&&o.is(":visible")||(o.css("opacity",0).show(),c=1);a<f;a++)o.animate({opacity:c},r,i.easing),c=1-c;o.animate({opacity:c},r,i.easing),o.queue(t),e.effects.unshift(o,d,f+1)}))}));