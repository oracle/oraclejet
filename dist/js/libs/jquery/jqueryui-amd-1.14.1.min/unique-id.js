/*!
 * jQuery UI Unique ID 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):"object"==typeof module&&module.exports?(require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.fn.extend({uniqueId:(i=0,function(){return this.each((function(){this.id||(this.id="ui-id-"+ ++i)}))}),removeUniqueId:function(){return this.each((function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")}))}});var i}));