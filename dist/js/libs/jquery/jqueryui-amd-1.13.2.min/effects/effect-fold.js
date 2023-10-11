/*!
 * jQuery UI Effects Fold 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("fold","hide",(function(i,t){var c=e(this),n=i.mode,o="show"===n,s="hide"===n,f=i.size||15,r=/([0-9]+)%/.exec(f),u=!!i.horizFirst?["right","bottom"]:["bottom","right"],l=i.duration/2,a=e.effects.createPlaceholder(c),p=c.cssClip(),d={clip:e.extend({},p)},m={clip:e.extend({},p)},h=[p[u[0]],p[u[1]]],q=c.queue().length;r&&(f=parseInt(r[1],10)/100*h[s?0:1]),d.clip[u[0]]=f,m.clip[u[0]]=f,m.clip[u[1]]=0,o&&(c.cssClip(m.clip),a&&a.css(e.effects.clipToBox(m)),m.clip=p),c.queue((function(t){a&&a.animate(e.effects.clipToBox(d),l,i.easing).animate(e.effects.clipToBox(m),l,i.easing),t()})).animate(d,l,i.easing).animate(m,l,i.easing).queue(t),e.effects.unshift(c,q,4)}))}));