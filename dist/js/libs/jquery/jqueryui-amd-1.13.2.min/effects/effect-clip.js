/*!
 * jQuery UI Effects Clip 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("clip","hide",(function(t,i){var o,r={},c=e(this),f=t.direction||"vertical",n="both"===f,u=n||"horizontal"===f,l=n||"vertical"===f;o=c.cssClip(),r.clip={top:l?(o.bottom-o.top)/2:o.top,right:u?(o.right-o.left)/2:o.right,bottom:l?(o.bottom-o.top)/2:o.bottom,left:u?(o.right-o.left)/2:o.left},e.effects.createPlaceholder(c),"show"===t.mode&&(c.cssClip(r.clip),r.clip=o),c.animate(r,{queue:!1,duration:t.duration,easing:t.easing,complete:i})}))}));