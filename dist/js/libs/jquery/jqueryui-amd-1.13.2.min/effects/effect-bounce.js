/*!
 * jQuery UI Effects Bounce 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("bounce",(function(t,i){var o,u,n,r=e(this),f=t.mode,c="hide"===f,s="show"===f,a=t.direction||"up",d=t.distance,p=t.times||5,m=2*p+(s||c?1:0),h=t.duration/m,l=t.easing,y="up"===a||"down"===a?"top":"left",q="up"===a||"left"===a,j=0,g=r.queue().length;for(e.effects.createPlaceholder(r),n=r.css(y),d||(d=r["top"===y?"outerHeight":"outerWidth"]()/3),s&&((u={opacity:1})[y]=n,r.css("opacity",0).css(y,q?2*-d:2*d).animate(u,h,l)),c&&(d/=Math.pow(2,p-1)),(u={})[y]=n;j<p;j++)(o={})[y]=(q?"-=":"+=")+d,r.animate(o,h,l).animate(u,h,l),d=c?2*d:d/2;c&&((o={opacity:0})[y]=(q?"-=":"+=")+d,r.animate(o,h,l)),r.queue(i),e.effects.unshift(r,g,m+1)}))}));