/*!
 * jQuery UI Unique ID 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.fn.extend({uniqueId:function(){var uuid=0;return function(){return this.each((function(){if(!this.id){this.id="ui-id-"+ ++uuid}}))}}(),removeUniqueId:function(){return this.each((function(){if(/^ui-id-\d+$/.test(this.id)){$(this).removeAttr("id")}}))}})}));
