/*!
 * jQuery UI Effects Slide 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("slide","show",(function(t,i){var o,r,s=e(this),c={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},n=t.mode,u=t.direction||"left",f="up"===u||"down"===u?"top":"left",l="up"===u||"left"===u,p=t.distance||s["top"===f?"outerHeight":"outerWidth"](!0),d={};e.effects.createPlaceholder(s),o=s.cssClip(),r=s.position()[f],d[f]=(l?-1:1)*p+r,d.clip=s.cssClip(),d.clip[c[u][1]]=d.clip[c[u][0]],"show"===n&&(s.cssClip(d.clip),s.css(f,d[f]),d.clip=o,d[f]=r),s.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:i})}))}));