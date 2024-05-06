/*!
 * jQuery UI Effects Shake 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("shake",(function(t,i){var n=1,f=e(this),u=t.direction||"left",r=t.distance||20,a=t.times||3,o=2*a+1,s=Math.round(t.duration/o),c="up"===u||"down"===u?"top":"left",d="up"===u||"left"===u,m={},l={},p={},q=f.queue().length;for(e.effects.createPlaceholder(f),m[c]=(d?"-=":"+=")+r,l[c]=(d?"+=":"-=")+2*r,p[c]=(d?"-=":"+=")+2*r,f.animate(m,s,t.easing);n<a;n++)f.animate(l,s,t.easing).animate(p,s,t.easing);f.animate(l,s,t.easing).animate(m,s/2,t.easing).queue(i),e.effects.unshift(f,q,o+1)}))}));