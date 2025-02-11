/*!
 * jQuery UI Effects Puff 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect","./effect-scale"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),require("./effect-scale"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("puff","hide",(function(f,t){var r=e.extend(!0,{},f,{fade:!0,percent:parseInt(f.percent,10)||150});e.effects.effect.scale.call(this,r,t)}))}));