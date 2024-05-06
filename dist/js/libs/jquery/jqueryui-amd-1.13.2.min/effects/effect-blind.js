/*!
 * jQuery UI Effects Blind 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("blind","hide",(function(t,i){var o={up:["bottom","top"],vertical:["bottom","top"],down:["top","bottom"],left:["right","left"],horizontal:["right","left"],right:["left","right"]},r=e(this),c=t.direction||"up",n=r.cssClip(),f={clip:e.extend({},n)},s=e.effects.createPlaceholder(r);f.clip[o[c][0]]=f.clip[o[c][1]],"show"===t.mode&&(r.cssClip(f.clip),s&&s.css(e.effects.clipToBox(f)),f.clip=n),s&&s.animate(e.effects.clipToBox(f),t.duration,t.easing),r.animate(f,{queue:!1,duration:t.duration,easing:t.easing,complete:i})}))}));