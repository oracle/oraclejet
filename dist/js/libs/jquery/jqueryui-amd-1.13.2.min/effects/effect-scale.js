/*!
 * jQuery UI Effects Scale 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect","./effect-size"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),require("./effect-size"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("scale",(function(t,i){var f=e(this),r=t.mode,n=parseInt(t.percent,10)||(0===parseInt(t.percent,10)||"effect"!==r?0:100),c=e.extend(!0,{from:e.effects.scaledDimensions(f),to:e.effects.scaledDimensions(f,n,t.direction||"both"),origin:t.origin||["middle","center"]},t);t.fade&&(c.from.opacity=1,c.to.opacity=0),e.effects.effect.size.call(this,c,i)}))}));